import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AugmentedRealityRoutingModule } from './augmented-reality-routing.module';
import { AugmentedRealityComponent } from './augmented-reality.component';

import { ArImgDetectComponent } from './ar-img-detect/ar-img-detect.component';
import { ThreeAnimationAndTextureComponent } from './three-animation-and-texture/three-animation-and-texture.component';
import { ThreeCubeComponent } from './three-cube/three-cube.component';
import { ThreeGlbComponent } from './three-glb/three-glb.component';
import { ThreeObjComponent } from './three-obj/three-obj.component';

@NgModule({
  declarations: [
    AugmentedRealityComponent,
    ThreeCubeComponent,
    ThreeObjComponent,
    ThreeGlbComponent,
    ThreeAnimationAndTextureComponent,
    ArImgDetectComponent,
  ],
  imports: [CommonModule, AugmentedRealityRoutingModule],
})
export class AugmentedRealityModule {}
