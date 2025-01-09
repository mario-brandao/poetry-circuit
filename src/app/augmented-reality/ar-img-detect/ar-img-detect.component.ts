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
  Mesh,
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

  private markerRoot1!: Group;
  private mesh1!: Mesh;

  // private markerConfigurations: config[] = [
  //   {
  //     patternUrl: 'assets/libs/data/letterA.patt',
  //     modelUrl: 'assets/3d/[NOME_DO_POETA]/[NOME_DO_POETA]-poesia.glb',
  //     audioUrl: 'assets/3d/[NOME_DO_POETA]/[NOME_DO_POETA]-poesia.mp3',
  //     scale: [3, 3, 3],
  //     position: [0, 0, 0],
  //     rotation: [0, 0, 0],
  //     color: 0xff0000,
  //   },
  //   {
  //     patternUrl: 'assets/libs/data/letterA.patt',
  //     modelUrl: 'assets/3d/[NOME_DO_POETA]/[NOME_DO_POETA]-poesia-2.glb',
  //     audioUrl: 'assets/3d/[NOME_DO_POETA]/[NOME_DO_POETA]-poesia-2.mp3',
  //     scale: [3, 3, 3],
  //     position: [0, 0, 0],
  //     rotation: [0, 0, 0],
  //     color: 0xff0000,
  //   },
  // ];

  // private markerConfigurations: config[] = [
  //   {
  //     patternUrl: 'assets/libs/data/letterA.patt',
  //     modelUrl: 'assets/3d/ascenso/ascenso_5-maracatu_lite.glb',
  //     audioUrl: 'assets/3d/antonio-maria/Ascenso Ferreira - MARACATU.mp3',
  //     scale: [3, 3, 3],
  //     position: [0, 0, 0],
  //     rotation: [0, 0, 0],
  //     color: 0xff0000,
  //   },
  // {
  //   patternUrl: 'assets/libs/data/letterA.patt',
  //   modelUrl: 'assets/3d/ascenso/ascenso_trem-de-alagoas_lite.glb',
  //   audioUrl:
  //     'assets/3d/antonio-maria/Ascenso Ferreira - TREM DE ALAGOAS.mp3',
  //   scale: [0, 0, 0],
  //   position: [0, 0, 0],
  //   rotation: [0, 0, 0],
  //   color: 0xff0000,
  // },
  // {
  //   patternUrl: 'assets/libs/data/letterA.patt',
  //   modelUrl: 'assets/3d/antonio-maria/antonio maria5 - cafe com leite.glb',
  //   audioUrl: 'assets/3d/antonio-maria/Antonio Maria_CAFÉ COM LEITE.mp3',
  //   scale: [0, 0, 0],
  //   position: [0, 0, 0],
  //   color: 0x00ff00,
  // },
  // {
  //   patternUrl: 'assets/libs/data/letterA.patt',
  //   modelUrl: 'assets/3d/antonio-maria/antonio maria6 - ninguem me ama.glb',
  //   audioUrl: 'assets/3d/antonio-maria/Antonio Maria_NINGUÉM ME AMA.mp3',
  //   scale: [0, 0, 0],
  //   position: [0, 0, 0],
  //   color: 0x00ff00,
  // },
  // Adicione mais configurações conforme necessário
  // ];

  logs: string[] = [];

  private poet: string = '';
  private markerConfigurations: config[] = [];

  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      // TODO: reset everything before changing poet/poetry
      console.log({ params });

      this.poet = params['poet'] || 'default';

      this.markerConfigurations = [
        {
          patternUrl: 'assets/libs/data/letterA.patt',
          modelUrl: `assets/3d/${this.poet}/${this.poet}-poesia.glb`,
          audioUrl: `assets/3d/${this.poet}/${this.poet}-poesia.mp3`,
          scale: [3, 3, 3],
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          color: 0xff0000,
        },
        {
          patternUrl: 'assets/libs/data/letterA.patt',
          modelUrl: `assets/3d/${this.poet}/${this.poet}-poesia-2.glb`,
          audioUrl: `assets/3d/${this.poet}/${this.poet}-poesia-2.mp3`,
          scale: [3, 3, 3],
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          color: 0xff0000,
        },
      ];

      console.log(this.markerConfigurations);

      // Inicializa o AR com as novas configurações
      this.initializeAR();
    });
    // this.initializeAR();
  }

  ngOnDestroy(): void {
    this.positionalAudio.stop();
    window.removeEventListener('resize', this.onResize);
  }

  // private initializeAR(): void {
  //   this.scene = new Scene();

  //   const ambientLight = new AmbientLight(0xcccccc, 0.5);
  //   this.scene.add(ambientLight);

  //   this.camera = new Camera();
  //   this.scene.add(this.camera);

  //   this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
  //   this.renderer.setSize(window.innerWidth, window.innerHeight);
  //   this.renderer.setClearColor(new Color('lightgrey'), 0);
  //   this.renderer.setPixelRatio(window.devicePixelRatio);

  //   this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

  //   this.clock = new Clock();
  //   this.deltaTime = 0;
  //   this.totalTime = 0;

  //   // ARToolkit setup
  //   this.arToolkitSource = new THREEx.ArToolkitSource({ sourceType: 'webcam' });
  //   this.arToolkitSource.init(() => this.onResize());

  //   this.arToolkitContext = new THREEx.ArToolkitContext({
  //     cameraParametersUrl: 'assets/libs/data/camera_para.dat',
  //     detectionMode: 'mono'
  //   });
  //   this.arToolkitContext.init(() => {
  //     this.camera.projectionMatrix.copy(this.arToolkitContext.getProjectionMatrix());
  //   });

  //   // Marker setup
  //   this.markerRoot1 = new Group();
  //   this.scene.add(this.markerRoot1);

  //   const markerControls1 = new THREEx.ArMarkerControls(this.arToolkitContext, this.markerRoot1, {
  //     type: 'pattern',
  //     patternUrl: 'assets/libs/data/hiro.patt'
  //   });

  //   const geometry1 = new BoxGeometry(1, 1, 1);
  //   const material1 = new MeshNormalMaterial({
  //     transparent: true,
  //     opacity: 0.5,
  //     side: DoubleSide
  //   });

  //   this.mesh1 = new Mesh(geometry1, material1);
  //   this.mesh1.position.y = 0.5;
  //   this.markerRoot1.add(this.mesh1);

  //   // Handle resize
  //   window.addEventListener('resize', () => this.onResize());

  //   this.animate();
  // }
  private initializeAR(): void {
    this.scene = new Scene();

    const ambientLight = new AmbientLight(0xcccccc, 0.5);
    this.scene.add(ambientLight);

    this.camera = new Camera();
    this.scene.add(this.camera);

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(new Color('lightgrey'), 0);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    this.clock = new Clock();
    this.deltaTime = 0;
    this.totalTime = 0;

    // Setup ARToolkit
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

    // Configure markers and models
    this.markerConfigurations.forEach((config: config) =>
      this.addMarker(config)
    );

    // Handle resize
    window.addEventListener('resize', () => this.onResize());

    this.animate();
  }

  private addMarker(config: config): void {
    const markerRoot = new Group();
    this.scene.add(markerRoot);

    const markerControls = new THREEx.ArMarkerControls(
      this.arToolkitContext,
      markerRoot,
      {
        type: 'pattern',
        patternUrl: config.patternUrl,
      }
    );

    // Carregar modelo 3D
    const loader = new GLTFLoader();
    loader.load(
      config.modelUrl,
      (gltf: GLTF) => {
        console.log(`loaded model ${config.modelUrl}`);
        this.logs.push(`loaded model ${config.modelUrl}`);
        const model = gltf.scene;
        const [scaleX, scaleY, scaleZ] = config.scale;
        const [positionX, positionY, positionZ] = config.position;
        const [rotationX, rotationY, rotationZ] = config.rotation;
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
        this.addAudio(config.audioUrl);

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
    //   color: config.color,
    //   transparent: true,
    //   opacity: 0.5,
    // });
    // const mesh = new Mesh(geometry, material);
    // markerRoot.add(mesh);
    console.log(this.scene);
  }

  private addAudio(audioPath: string): void {
    // Carregar o arquivo de áudio
    const audioLoader = new AudioLoader();
    this.positionalAudio = new PositionalAudio(this.audioListener); // Usando PositionalAudio para um efeito 3D

    audioLoader.load(audioPath, (buffer) => {
      this.positionalAudio.setBuffer(buffer);
      this.positionalAudio.setLoop(true); // Configure se você quer que o áudio faça loop
      this.positionalAudio.setVolume(0.5); // Ajuste o volume

      // Reproduzir o áudio sincronizado com a animação
      this.positionalAudio.play();
    });

    // Adicionar o áudio à cena (vinculado ao modelo)
    this.model.add(this.positionalAudio);
  }

  private onResize = (): void => {
    this.arToolkitSource.onResize();
    this.arToolkitSource.copySizeTo(this.renderer.domElement);

    if (this.arToolkitContext.arController !== null) {
      this.arToolkitSource.copySizeTo(
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
