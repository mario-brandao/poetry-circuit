import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { overlayAnimations } from './loading-overlay.animations';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
  animations: overlayAnimations,
})
export class LoadingOverlayComponent implements OnInit, OnChanges {
  @Input() loaded = 0; // Valor carregado
  @Input() total = 100; // Valor total do asset

  progress = 0;
  showOverlay = true;

  ngOnInit(): void {
    this.updateProgress();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.loaded || changes.total) {
      this.updateProgress();
    }
  }

  private updateProgress(): void {
    this.progress = this.total > 0 ? (this.loaded / this.total) * 100 : 0;

    if (this.progress >= 100) {
      // Espera a animação completar antes de remover o overlay
      setTimeout(() => (this.showOverlay = false), 1000);
    }
  }
}
