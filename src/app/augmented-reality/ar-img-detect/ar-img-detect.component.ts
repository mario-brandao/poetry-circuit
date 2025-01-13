import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// import * as ArtoolkitMin from 'src/assets/jsartoolkit5/artoolkit.min.js';
// import * as ArtoolkitApi from 'src/assets/jsartoolkit5/artoolkit.api.js';
// import * as ThreexArtoolkitsource from 'src/assets/threex/threex-artoolkitsource.js';
// import * as ThreexArtoolkitcontext from 'src/assets/threex/threex-artoolkitcontext.js';
// import * as ThreexArbasecontrols from 'src/assets/threex/threex-arbasecontrols.js';
// import * as ThreexArmarkercontrols from 'src/assets/threex/threex-armarkercontrols.js';
// import 'src/assets/libs/threex/threex-artoolkitsource.js';
// import 'src/assets/libs/threex/threex-artoolkitcontext.js';
// import 'src/assets/libs/threex/threex-arbasecontrols.js';
// import 'src/assets/libs/threex/threex-armarkercontrols.js';
import {
  AmbientLight,
  AnimationMixer,
  AudioListener,
  AudioLoader,
  Camera,
  Clock,
  Color,
  Group,
  PositionalAudio,
  Scene,
  WebGLRenderer,
} from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

declare const THREEx: any;

interface config {
  patternUrl: string;
  modelUrl: string;
  audioUrl: string;
  scale: number[];
  position: number[];
  rotation: number[];
  color: any;
}

@Component({
  selector: 'app-ar-img-detect',
  templateUrl: './ar-img-detect.component.html',
  styleUrls: ['./ar-img-detect.component.scss'],
})
export class ArImgDetectComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef;

  private scene!: Scene;
  private camera!: Camera;
  private renderer!: WebGLRenderer;
  private mixer!: THREE.AnimationMixer;
  private model!: THREE.Group;
  private audioListener!: AudioListener;
  private positionalAudio!: PositionalAudio;
  private clock!: Clock;
  private deltaTime!: number;
  private totalTime!: number;

  private arToolkitSource: any;
  private arToolkitContext: any;

  logs: string[] = [];

  private poet: string = '';
  private poetry: string = '';
  private markerConfigurations: config;

  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      const poetParam = params['poet'] || 'ascenso';
      const poetryParam = params['poetry'] || 'maracatu';
      const paramsChanged =
        this.poet !== poetParam || this.poetry !== poetryParam;

      if (paramsChanged) {
        this.resetViewParams(poetParam, poetryParam);
        this.initializeAR();
      }
    });
  }

  ngOnDestroy(): void {
    this.clearAR();
  }

  resetViewParams(poet: string, poetry: string): void {
    this.poet = poet;
    this.poetry = poetry;
    this.markerConfigurations = {
      patternUrl: 'assets/pattern-cp.patt',
      // patternUrl: 'assets/libs/data/letterA.patt',
      modelUrl: `assets/3d/${this.poet}/${this.poetry}.glb`,
      audioUrl: `assets/3d/${this.poet}/${this.poetry}.mp3`,
      scale: [3, 3, 3],
      position: [0, 0, 0],
      rotation: [-1, 0, 0],
      color: 0xff0000,
    };
  }

  private clearAR(): void {
    this.positionalAudio?.stop();
    window.removeEventListener('resize', this.onResize);
    this.rendererContainer.nativeElement.innerHTML = '';
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss(); // Para garantir que o WebGL seja liberado
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
    this.clearAR();

    this.scene = new Scene();

    const ambientLight = new AmbientLight(0xcccccc, 0.5);
    this.scene.add(ambientLight);

    this.camera = new Camera();
    this.audioListener = new AudioListener();
    this.camera.add(this.audioListener);
    this.scene.add(this.camera);

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(new Color('lightgrey'), 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    this.clock = new Clock();
    this.deltaTime = 0;
    this.totalTime = 0;

    this.arToolkitSource = new THREEx.ArToolkitSource({ sourceType: 'webcam' });
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

    // TODO: fix browser issue
    this.audioListener = new AudioListener();
    this.camera.add(this.audioListener);
    this.addMarker();

    window.addEventListener('resize', () => this.onResize());

    this.animate();
  }

  private addMarker(): void {
    const markerRoot = new Group();
    this.scene.add(markerRoot);

    const markerControls = new THREEx.ArMarkerControls(
      this.arToolkitContext,
      markerRoot,
      {
        type: 'pattern',
        patternUrl: this.markerConfigurations.patternUrl,
      }
    );

    // Carregar modelo 3D
    const loader = new GLTFLoader();
    loader.load(
      this.markerConfigurations.modelUrl,
      (gltf: GLTF) => {
        console.log(`loaded model ${this.markerConfigurations.modelUrl}`);
        this.logs.push(`loaded model ${this.markerConfigurations.modelUrl}`);

        const model = gltf.scene;
        const [scaleX, scaleY, scaleZ] = this.markerConfigurations.scale;
        const [positionX, positionY, positionZ] =
          this.markerConfigurations.position;
        const [rotationX, rotationY, rotationZ] =
          this.markerConfigurations.rotation;
        model.scale.set(scaleX, scaleY, scaleZ);
        model.position.set(positionX, positionY, positionZ);
        model.rotation.set(rotationX, rotationY, rotationZ);

        // Configurar animações, se existirem
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new AnimationMixer(model);
          gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
          // Salve o mixer para atualização no loop de animação, se necessário
          this.mixer = mixer;
        }

        markerRoot.add(model);

        console.log(markerRoot, model);
        this.model = model;

        this.addAudio(this.markerConfigurations.audioUrl);

        console.log(markerRoot);
      },
      (x) => {
        if (x.type !== 'progress') {
          console.log('error', x);
          this.logs.push('load error');
          this.logs.push(JSON.stringify(x));
        }
      }
    );

    // Opcional: Adicionar cubo ou textura básica para depuração
    // const geometry = new BoxGeometry(1, 1, 1);
    // const material = new MeshBasicMaterial({
    //   color: this.markerConfigurations.color,
    //   transparent: true,
    //   opacity: 0.5,
    // });
    // const mesh = new Mesh(geometry, material);
    // markerRoot.add(mesh);
    console.log(this.scene);
  }

  private addAudio(audioPath: string): void {
    this.logs.push('add audio');
    // Carregar o arquivo de áudio
    const audioLoader = new AudioLoader();
    this.positionalAudio = new PositionalAudio(this.audioListener); // Usando PositionalAudio para um efeito 3D

    this.logs.push('add audio 2');

    audioLoader.load(audioPath, (buffer) => {
      this.logs.push('add audio 3');

      this.positionalAudio.setBuffer(buffer);
      this.positionalAudio.setLoop(true); // Configure se você quer que o áudio faça loop
      this.positionalAudio.setVolume(0.5); // Ajuste o volume

      this.logs.push('add audio 4');

      // Reproduzir o áudio sincronizado com a animação
      this.positionalAudio.play();
    });

    this.logs.push('add audio 5');

    // Adicionar o áudio à cena (vinculado ao modelo)
    this.model.add(this.positionalAudio);
    this.logs.push('add audio 6');
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
    requestAnimationFrame(this.animate);
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
}
