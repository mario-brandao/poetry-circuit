import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { AudioListener, PositionalAudio } from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'app-three-animation-and-texture',
  templateUrl: './three-animation-and-texture.component.html',
  styleUrls: ['./three-animation-and-texture.component.scss'],
})
export class ThreeAnimationAndTextureComponent
  implements OnDestroy, AfterViewInit
{
  @ViewChild('canvas') canvasRef!: ElementRef;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private mixer!: THREE.AnimationMixer;
  private clock = new THREE.Clock();
  private model!: THREE.Group;
  private audioListener!: AudioListener;
  private positionalAudio!: PositionalAudio;

  constructor() {}

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.animate();
  }

  ngOnDestroy(): void {
    this.positionalAudio.stop();
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;

    // Criar a cena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    // Configurar a câmera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 5); // Ajustar conforme necessário para sua cena

    // Configurar o renderizador
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Adicionar um AudioListener à câmera (para ouvir sons na cena)
    this.audioListener = new THREE.AudioListener();
    this.camera.add(this.audioListener);

    // Carregar o modelo .glb
    const loader = new GLTFLoader();
    // Antonio maria
    // loader.load('assets/3d/antonio-maria/antonio maria6 - ninguem me ama.glb', (gltf) => {
    // loader.load('assets/3d/antonio-maria/antonio maria5 - cafe com leite.glb', (gltf) => {

    loader.load(
      'assets/3d/antonio-maria/antonio maria5 - cafe com leite.glb',
      (gltf) => {
        console.log(gltf.scene);
      }
    );

    loader.load(
      'assets/3d/ascenso/ascenso_trem-de-alagoas_lite.glb',
      (gltf: GLTF) => {
        console.log(gltf.scene);
      }
    );

    // Ascenso
    loader.load(
      'assets/3d/ascenso/ascenso_trem-de-alagoas_lite.glb',
      (gltf: GLTF) => {
        // loader.load('assets/3d/ascenso/ascenso_5-maracatu_lite.glb', (gltf) => {

        // Monkey
        // loader.load('assets/test/animation-and-texture/macaco-teste.glb', (gltf) => {
        this.model = gltf.scene;
        this.model.scale.set(3, 3, 3);
        this.model.rotateY(3);

        this.scene.add(this.model);

        // Verificar se há animações no arquivo .glb
        if (gltf.animations && gltf.animations.length > 0) {
          this.mixer = new THREE.AnimationMixer(this.model);
          gltf.animations.forEach((clip) => {
            const action = this.mixer.clipAction(clip);
            action.play(); // Iniciar a animação
          });
        }

        // Carregar e adicionar o áudio
        // this.addAudio('assets/3d/ascenso/Ascenso Ferreira - MARACATU.mp3');
        this.addAudio(
          'assets/3d/antonio-maria/Antonio Maria_CAFÉ COM LEITE.mp3'
        );
      }
    );

    // Adicionar luz à cena
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    this.scene.add(light);
  }

  // private addAudio(gltf): void {
  //   // Procura e inicia o áudio embutido
  //   this.model.traverse((object) => {
  //       // if (object.isAudio) {
  //       //     object.setLoop(true); // Configura o áudio para repetir se desejado
  //       //     object.play();        // Inicia o áudio
  //       // }
  //   });

  //   // Inicia as animações, se houverem
  //   const mixer = new THREE.AnimationMixer(this.model);
  //   gltf.animations.forEach((clip) => {
  //       mixer.clipAction(clip).play();
  //   });
  // }

  private addAudio(audioPath: string): void {
    // Carregar o arquivo de áudio
    const audioLoader = new THREE.AudioLoader();
    this.positionalAudio = new THREE.PositionalAudio(this.audioListener); // Usando PositionalAudio para um efeito 3D

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

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    // Atualizar as animações
    if (this.mixer) {
      const delta = this.clock.getDelta();
      this.mixer.update(delta);
    }

    // Renderizar a cena
    this.renderer.render(this.scene, this.camera);
  }
}
