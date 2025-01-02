import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArImgDetectComponent } from './ar-img-detect/ar-img-detect.component';
import { AugmentedRealityComponent } from './augmented-reality.component';
import { ThreeAnimationAndTextureComponent } from './three-animation-and-texture/three-animation-and-texture.component';

const routes: Routes = [
  {
    path: '',
    component: AugmentedRealityComponent,
    children: [
      {
        path: '',
        component: ArImgDetectComponent,
      },
      {
        path: 'monkey',
        component: ThreeAnimationAndTextureComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AugmentedRealityRoutingModule {}
