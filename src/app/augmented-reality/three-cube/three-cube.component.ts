import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-cube',
  templateUrl: './three-cube.component.html',
  styleUrls: ['./three-cube.component.scss']
})
export class ThreeCubeComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private cube!: THREE.Mesh;

  constructor() { }

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.animate();
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;

    // Configurando a cena
    this.scene = new THREE.Scene();

    // Configurando a câmera (campo de visão, proporção, plano de recorte próximo e distante)
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Configurando o renderizador
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Carregando texturas
    const textureLoader = new THREE.TextureLoader();
    const texture1 = textureLoader.load('assets/test/teste.1001.png');
    const texture2 = textureLoader.load('assets/test/teste.1002.png');
    const texture3 = textureLoader.load('assets/test/teste.1003.png');

    // Criando o material do cubo com diferentes texturas para 3 lados
    const materials = [
      new THREE.MeshBasicMaterial({ map: texture1 }), // Lado 1
      new THREE.MeshBasicMaterial({ map: texture2 }), // Lado 2
      new THREE.MeshBasicMaterial({ map: texture3 }), // Lado 3
      new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Lado 4
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Lado 5
      new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Lado 6
    ];

    // Criando a geometria do cubo
    const geometry = new THREE.BoxGeometry(2, 2, 2);

    // Criando o cubo com a geometria e os materiais
    this.cube = new THREE.Mesh(geometry, materials);
    this.scene.add(this.cube);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    // Rotacionar o cubo para dar vida à cena
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;

    // Renderizando a cena e a câmera
    this.renderer.render(this.scene, this.camera);
  }
}
