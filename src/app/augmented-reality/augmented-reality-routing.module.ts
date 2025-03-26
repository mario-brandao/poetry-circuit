import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArImgDetectComponent } from './ar-img-detect/ar-img-detect.component';
import { AugmentedRealityComponent } from './augmented-reality.component';

const routes: Routes = [
  {
    path: '',
    component: AugmentedRealityComponent,
    children: [
      {
        path: ':writer',
        component: AugmentedRealityComponent,
        children: [
          {
            path: ':poem',
            component: ArImgDetectComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AugmentedRealityRoutingModule {}
