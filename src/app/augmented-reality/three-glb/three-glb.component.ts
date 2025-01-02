import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


@Component({
  selector: 'app-three-glb',
  templateUrl: './three-glb.component.html',
  styleUrls: ['./three-glb.component.scss']
})
export class ThreeGlbComponent  implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private object!: THREE.Object3D;

  constructor() { }

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.animate();
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;

    // Configuração da cena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xeeeeee);

    // Configuração da câmera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Configuração do renderizador
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Carregar o modelo .glb
    const glbLoader = new GLTFLoader();
    glbLoader.load('assets/test/glb/macaco.glb', (obj: any) => {
      this.scene = obj;
      console.log(obj);
      // this.object.scale.set(1, 1, 1); // Ajusta o tamanho do objeto se necessário
      
      // this.scene.add(obj);
    });

    // Adicionar iluminação básica
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    this.scene.add(light);

    this.renderer.render(this.scene, this.camera);

  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    // Se o objeto for carregado, podemos rotacioná-lo
    // if (this.object) {
    //   this.object.rotation.x += 0.01;
    //   this.object.rotation.y += 0.01;
    // }

    // Renderizar a cena
    // this.renderer.render(this.scene, this.camera);
  }
}
