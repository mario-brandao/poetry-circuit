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
        path: '',
        component: ArImgDetectComponent,
        // children: [
        //   {
        //     path: 'ascenso-maracatu',
        //     data: { poetry: 'ascenso-maracatu' },
        //   },
        //   {
        //     path: 'ascenso-trem-de-alagoas',
        //     data: { poetry: 'ascenso-trem-de-alagoas' },
        //   },
        // ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AugmentedRealityRoutingModule {}
