import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
@NgModule({
  declarations: [LoadingOverlayComponent, LoadingSpinnerComponent],
  imports: [CommonModule],
  exports: [LoadingOverlayComponent, LoadingSpinnerComponent],
})
export class SharedModule {}
