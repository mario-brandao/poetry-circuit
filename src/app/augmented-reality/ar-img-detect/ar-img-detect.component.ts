import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  Color,
  ColorRepresentation,
  Group,
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
  private writer: string = '';
  private poem: string = '';
  private markerConfigurations: config;
  private animationFrameId: number;
  private $destroy = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
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

  ngOnDestroy(): void {
    this.$destroy.next();
    this.clearAR();
  }

  async start(writer: string, poem: string): Promise<void> {
    await this.resetViewParams(writer, poem);
    this.initializeAR();
  }

  // TODO: fix
  async restart(writer: string, poem: string): Promise<void> {
    this.clearAR();
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

  private clearAR(): void {
    this.clearAnimations();
    // setTimeout(() => {
    if (this.audioListener?.clear) {
      this.audioListener.clear();
    }
    if (this.positionalAudio?.stop) {
      this.positionalAudio.stop();
    }
    if (this.arToolkitContext?.stop) {
      this.arToolkitContext.stop();
    }
    window.removeEventListener('resize', this.onResize);
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
    // });
  }

  private initializeAR(): void {
    this.zone.runOutsideAngular(() => {
      this.clearAR();

      this.scene = new Scene();
      const ambientLight = new AmbientLight(0xcccccc, 0.5);
      this.scene.add(ambientLight);

      this.camera = new Camera();
      this.scene.add(this.camera);

      this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setClearColor(new Color('lightgrey'), 0);
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

    this.playAnimations(gltf.animations, model);
    this.model = model;

    this.markerRoot.add(model);

    const ambientLight = new AmbientLight(0xfffff, 1);
    this.markerRoot.add(ambientLight);
    this.addAudio(this.markerConfigurations.audioUrl);

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

    this.playAnimations(group.animations, model);
    this.model = model;

    this.markerRoot.add(model);

    const ambientLight = new AmbientLight(0xfffff, 1);
    this.markerRoot.add(ambientLight);
    this.addAudio(this.markerConfigurations.audioUrl);

    this.zone.run(() => {
      this.loading = false;
    });
  }

  playAnimations(animations: AnimationClip[], obj: Group): void {
    if (!animations?.length) {
      return;
    }
    this.mixer = new AnimationMixer(obj);

    animations.forEach((clip) => {
      this.log(clip.name);

      this.mixer.clipAction(clip).reset().play();
    });
  }

  clearAnimations(): void {
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

  private addAudio(audioPath: string): void {
    const audioLoader = new AudioLoader();
    this.positionalAudio = new PositionalAudio(this.audioListener);

    audioLoader.load(audioPath, (buffer) => {
      this.positionalAudio.setBuffer(buffer);
      this.positionalAudio.setLoop(true);
      this.positionalAudio.setVolume(1);
      this.positionalAudio.play();
      try {
        // TODO: testar adicionar o áudio vinculado ao modelo (nao a cena)
        this.model.add(this.positionalAudio);
        // this.scene.add(this.positionalAudio);
      } catch (error) {
        console.error(error);
        alert('Falha ao iniciar áudio');
      }

      this.audioListener = new AudioListener();
      this.camera.add(this.audioListener);
    });
  }

  private onResize = (): void => {
    this.arToolkitSource.onResizeElement();
    this.arToolkitSource.copyElementSizeTo(this.renderer.domElement);

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
}
