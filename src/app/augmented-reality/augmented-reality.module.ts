import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AugmentedRealityRoutingModule } from './augmented-reality-routing.module';
import { AugmentedRealityComponent } from './augmented-reality.component';

import { SharedModule } from '../shared/shared.module';
import { ArImgDetectComponent } from './ar-img-detect/ar-img-detect.component';

@NgModule({
  declarations: [AugmentedRealityComponent, ArImgDetectComponent],
  imports: [CommonModule, AugmentedRealityRoutingModule, SharedModule],
})
export class AugmentedRealityModule {}
