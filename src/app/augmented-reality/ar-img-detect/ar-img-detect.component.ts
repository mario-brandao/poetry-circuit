import {
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StatuesService } from 'src/app/services/statues/statues.service';
import { environment } from 'src/environments/environment';

import {
  AmbientLight,
  AnimationClip,
  AnimationMixer,
  AudioListener,
  AudioLoader,
  Camera,
  Clock,
  ColorRepresentation,
  DirectionalLight,
  Group,
  HemisphereLight,
  PositionalAudio,
  Scene,
  WebGLRenderer,
} from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

declare const THREEx: any;

interface config {
  patternUrl: string;
  modelUrl: string;
  audioUrl: string;
  scale: number[];
  position: number[];
  rotation: number[];
  color: ColorRepresentation;
}

@Component({
  selector: 'app-ar-img-detect',
  templateUrl: './ar-img-detect.component.html',
  styleUrls: ['./ar-img-detect.component.scss'],
})
export class ArImgDetectComponent implements OnInit, OnDestroy {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef;

  private scene!: Scene;
  private camera!: Camera;
  private renderer!: WebGLRenderer;
  private mixer!: AnimationMixer;
  private model!: Group;
  private audioListener!: AudioListener;
  private positionalAudio!: PositionalAudio;
  private clock!: Clock;
  private deltaTime!: number;
  private totalTime!: number;
  private markerRoot: Group;

  private arToolkitSource: any;
  private arToolkitContext: any;

  logs: string[] = [];
  protected loading = true;
  protected loaded: number;
  protected total: number;
  protected playIconActive = false;
  protected audio: HTMLAudioElement;
  private writer: string = '';
  private poem: string = '';
  private markerConfigurations: config;
  private animations: AnimationClip[] = [];
  private animationFrameId: number;
  private $destroy = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone,
    private statuesService: StatuesService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.start(
      this.route.parent.snapshot.params.writer,
      this.route.snapshot.params.poem
    );
    this.watchRouteChanges();
  }

  async ngOnDestroy(): Promise<void> {
    this.$destroy.next();
    await this.clearAR();
  }

  // TODO: achar uma soluçao para identificar quando o usuario sai do site
  // esse blur event é detectado na confirmaçao pra abrir camera no celular de vlad
  // (ios v? chorme v?) ...
  @HostListener('window:blur', ['$event'])
  async onWindowBlur(_): Promise<void> {
    if (!this.scene) {
      return;
    }

    await this.clearAR();
    document.querySelector('video')?.remove();
    const statue = await this.statuesService.getStatueByNormalizedName(
      this.writer
    );

    window.location.href = `${
      window.location.href.split('/augmented-reality')[0]
    }/writer/${statue.id}`;
  }

  async start(writer: string, poem: string): Promise<void> {
    await this.resetViewParams(writer, poem);
    this.initializeAR();
  }

  async restart(writer: string, poem: string): Promise<void> {
    await this.clearAR();
    await this.resetViewParams(writer, poem);
    this.initializeAR();
  }

  watchRouteChanges(): void {
    this.route.params.pipe(takeUntil(this.$destroy)).subscribe((_) => {
      const writer = this.route.parent.snapshot.params.writer;
      const poem = this.route.snapshot.params.poem;
      const paramsChanged = this.writer !== writer || this.poem !== poem;

      if (writer && poem && paramsChanged) {
        this.restart(writer, poem);
      }
    });
  }

  async resetViewParams(writer: string, poem: string): Promise<void> {
    this.writer = writer;
    this.poem = poem;

    const settings = await this.statuesService.getStatueSettings(
      this.writer,
      this.poem
    );

    this.markerConfigurations = {
      patternUrl: `${environment.baseAssetsUrl}/writers-media/${this.writer}/target.patt`,
      audioUrl: `${environment.baseAssetsUrl}/writers-media/${this.writer}/${this.poem}.mp3`,
      modelUrl: `${environment.baseAssetsUrl}/writers-media/${this.writer}/${this.poem}.glb`,
      ...settings,
      color: 0xffffff,
    };
  }

  private async clearAR(): Promise<void> {
    this.clearAnimations();

    if (this.audio) {
      await this.audio.pause();
    }
    window.removeEventListener('resize', this.onResize);
    this.arToolkitSource;
    this.rendererContainer.nativeElement.innerHTML = '';
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer.domElement = null;
      this.renderer = null;
    }

    if (this.scene) {
      this.scene.traverse((object: any) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material: any) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
        if (object.texture) {
          object.texture.dispose();
        }
      });

      this.scene = null;
    }

    if (this.camera) {
      this.camera = null;
    }
  }

  private initializeAR(): void {
    this.zone.runOutsideAngular(async () => {
      await this.clearAR();

      this.scene = new Scene();

      // Luz ambiente suave
      const ambientLight = new AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);

      // Luz direcional simulando o sol
      const directionalLight = new DirectionalLight(0xffffff, 1.2);
      directionalLight.position.set(5, 10, 7.5);
      directionalLight.castShadow = true;
      this.scene.add(directionalLight);

      // Luz hemisférica para simular céu e chão
      const hemisphereLight = new HemisphereLight(0xffffbb, 0x080820, 0.6);
      this.scene.add(hemisphereLight);

      this.camera = new Camera();
      this.scene.add(this.camera);

      this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(0xcccccc, 0);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      this.rendererContainer.nativeElement.appendChild(
        this.renderer.domElement
      );

      this.clock = new Clock();
      this.deltaTime = 0;
      this.totalTime = 0;

      this.arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
      });
      this.arToolkitSource.init(() => this.onResize());

      this.arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'assets/libs/data/camera_para.dat',
        detectionMode: 'mono',
      });
      this.arToolkitContext.init(() => {
        this.camera.projectionMatrix.copy(
          this.arToolkitContext.getProjectionMatrix()
        );
      });

      this.audioListener = new AudioListener();
      this.camera.add(this.audioListener);
      this.addMarker();

      window.addEventListener('resize', () => this.onResize());

      this.animate();
    });
  }

  private getLoader(
    modelUrl: string
  ):
    | [
        FBXLoader | GLTFLoader,
        (object: GLTF | Group) => void,
        (event: ProgressEvent) => void,
        (event: ErrorEvent) => void
      ]
    | null {
    const extension = modelUrl.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'glb':
        return [
          new GLTFLoader(),
          this.glftCallback.bind(this),
          this.progress.bind(this),
          this.error.bind(this),
        ];
      case 'fbx':
        return [
          new FBXLoader(),
          this.fbxCallback.bind(this),
          this.progress.bind(this),
          this.error.bind(this),
        ];
      default:
        alert(`Extensão de modelo não suportada: ${extension}`);
        return null;
    }
  }

  glftCallback(gltf: GLTF): void {
    const model = gltf.scene;
    const [scaleX, scaleY, scaleZ] = this.markerConfigurations.scale;
    const [positionX, positionY, positionZ] =
      this.markerConfigurations.position;
    const [rotationX, rotationY, rotationZ] =
      this.markerConfigurations.rotation;
    model.scale.set(scaleX, scaleY, scaleZ);
    model.position.set(positionX, positionY, positionZ);
    model.rotation.set(rotationX, rotationY, rotationZ);

    this.animations = gltf.animations;
    this.model = model;
    this.markerRoot.add(model);
    this.play();

    this.zone.run(() => {
      this.loading = false;
    });
  }

  fbxCallback(group: Group): void {
    const model = group;
    const [scaleX, scaleY, scaleZ] = this.markerConfigurations.scale;
    const [positionX, positionY, positionZ] =
      this.markerConfigurations.position;
    const [rotationX, rotationY, rotationZ] =
      this.markerConfigurations.rotation;
    model.scale.set(scaleX, scaleY, scaleZ);
    model.position.set(positionX, positionY, positionZ);
    model.rotation.set(rotationX, rotationY, rotationZ);

    this.animations = model.animations;
    this.model = model;
    this.markerRoot.add(model);
    this.play();

    this.zone.run(() => {
      this.loading = false;
    });
  }
  progress(xhr: ProgressEvent): void {
    this.zone.run(() => {
      this.loaded = xhr.loaded;
      this.total = xhr.total;
    });
  }

  error(error: ErrorEvent): void {
    if (error.type === 'progress') {
      return;
    }

    alert('Falha ao carregar modelo 3D');
    this.log('error', error);
    this.zone.run(() => {
      this.loading = false;
    });

    this.zone.run(() => {
      this.loaded = 100;
      this.total = 100;
    });
  }

  private addMarker(): void {
    this.markerRoot = new Group();
    this.scene.add(this.markerRoot);

    new THREEx.ArMarkerControls(this.arToolkitContext, this.markerRoot, {
      type: 'pattern',
      patternUrl: this.markerConfigurations.patternUrl,
    });

    this.loading = true;

    // const mockURL = `assets/writers-media/ascenso-ferreira/maracatu.glb`;
    // const mockURL = `assets/writers-media/ascenso-ferreira/trem-de-alagoas.glb`;
    // const mockURL = `assets/writers-media/antonio-maria/cafe-com-leite.glb`;
    // const mockURL = `assets/writers-media/antonio-maria/ninguem-me-ama.glb`;
    // const mockURL = `${environment.baseAssetsUrl}/writers-media/ascenso-ferreira/trem-de-alagoas.glb`;

    const [loader, onLoad, onProgress, onError] = this.getLoader(
      this.markerConfigurations.modelUrl
      // mockURL
    );
    loader.load(
      this.markerConfigurations.modelUrl,
      // mockURL,
      onLoad,
      onProgress,
      onError
    );
  }

  protected async play(): Promise<void> {
    this.getAudio();
    await this.playAudio();
    if (!this.playIconActive) {
      this.playAnimations();
    }
  }

  private playAnimations(): void {
    if (!this.animations?.length) {
      return;
    }
    this.mixer = new AnimationMixer(this.model);

    this.animations.forEach((clip) => {
      this.mixer.clipAction(clip).reset().play();
    });
  }

  private clearAnimations(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (!this.mixer) {
      return;
    }
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.mixer.getRoot());
    this.mixer = null;
  }

  private getAudio(): void {
    try {
      this.audio = new Audio(this.markerConfigurations.audioUrl);
      this.audio.loop = true;
      this.audio.volume = 1;
    } catch (error) {
      console.error('Erro ao carregar o áudio:', error);
      alert('Áudio não encontrado');
    }
  }

  async playAudio(withAlert = false): Promise<void> {
    try {
      if (withAlert) {
        this.audio
          .play()
          .then(() => {
            this.hidePlayIcon();
          })
          .catch(() => {
            this.handlePlayError();
          });
      } else {
        await this.audio.play();
        this.hidePlayIcon();
      }
    } catch (error) {
      this.showPlayIcon();
    }
  }

  handlePlayError(): void {
    this.showPlayIcon();
    alert('Falha ao iniciar áudio. Verifique as permissões do navegador.');
  }

  showPlayIcon(): void {
    this.zone.run(() => {
      this.playIconActive = true;
    });
  }

  hidePlayIcon(): void {
    this.zone.run(() => {
      this.playIconActive = false;
    });
  }

  // TODO: remove if not used
  private addPositionalAudio(audioPath: string): void {
    const audioLoader = new AudioLoader();
    this.positionalAudio = new PositionalAudio(this.audioListener);

    audioLoader.load(audioPath, (buffer) => {
      this.positionalAudio.setBuffer(buffer);
      this.positionalAudio.setLoop(true);
      this.positionalAudio.setVolume(1);
      this.positionalAudio.play();
      this.model.add(this.positionalAudio);
      this.audioListener = new AudioListener();
      this.camera.add(this.audioListener);
    });
  }

  private onResize = (): void => {
    this.arToolkitSource.onResizeElement();

    if (this.renderer) {
      this.arToolkitSource.copyElementSizeTo(this.renderer.domElement);
    }

    if (this.arToolkitContext.arController !== null) {
      this.arToolkitSource.copyElementSizeTo(
        this.arToolkitContext.arController.canvas
      );
    }
  };

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.deltaTime = this.clock.getDelta();
    this.totalTime += this.deltaTime;

    if (this.arToolkitSource.ready) {
      this.arToolkitContext.update(this.arToolkitSource.domElement);
    }
    if (this.mixer) {
      this.mixer.update(this.deltaTime);
    }

    this.renderer.render(this.scene, this.camera);
  };

  log(...log: any): void {
    // TODO: create flag for dev env only
    console.log(log);
    // this.logs.push(log);
  }

  onBack(): void {
    this.statuesService
      .getStatueByNormalizedName(this.writer)
      .then((statue) => {
        this.router.navigate(['/writer', statue.id]);
      });
  }
}
