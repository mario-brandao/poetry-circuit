import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';

@NgModule({
  declarations: [LoadingOverlayComponent],
  imports: [CommonModule],
  exports: [LoadingOverlayComponent],
})
export class SharedModule {}
