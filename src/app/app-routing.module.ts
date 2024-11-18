import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreeAnimationAndTextureComponent } from './three-animation-and-texture/three-animation-and-texture.component';
import { ArImgDetectComponent } from './ar-img-detect/ar-img-detect.component';

const routes: Routes = [
  {
    path: '',
    component: ArImgDetectComponent
  },
  {
    path: 'monkey',
    component: ThreeAnimationAndTextureComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
