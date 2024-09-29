import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationMixer } from 'three';

@Component({
  selector: 'app-three-animation-and-texture',
  templateUrl: './three-animation-and-texture.component.html',
  styleUrls: ['./three-animation-and-texture.component.scss']
})
export class ThreeAnimationAndTextureComponent  implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private mixer!: THREE.AnimationMixer;
  private clock = new THREE.Clock();
  private model!: THREE.Group;

  constructor() { }

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.animate();
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;

    // Criar a cena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    // Configurar a câmera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 2, 5); // Ajustar conforme necessário para sua cena

    // Configurar o renderizador
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Carregar o modelo .glb
    const loader = new GLTFLoader();
    loader.load('assets/test/animation-and-texture/macaco-teste.glb', (gltf) => {
      this.model = gltf.scene;
      this.scene.add(this.model);

      // Verificar se há animações no arquivo .glb
      if (gltf.animations && gltf.animations.length > 0) {
        this.mixer = new THREE.AnimationMixer(this.model);
        gltf.animations.forEach((clip) => {
          this.mixer.clipAction(clip).play();
        });
      }
    });

    // Adicionar luz à cena
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    this.scene.add(light);
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
