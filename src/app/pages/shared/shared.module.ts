import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoinIconComponent } from './components/coin-icon/coin-icon.component';
import { ScoreBarComponent } from './components/score-bar/score-bar.component';

@NgModule({
  declarations: [ScoreBarComponent, CoinIconComponent],
  imports: [CommonModule],
  exports: [ScoreBarComponent, CoinIconComponent],
})
export class SharedModule {}
