import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-coin-icon',
  templateUrl: './coin-icon.component.html',
  styleUrls: ['./coin-icon.component.scss'],
})
export class CoinIconComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() animated: boolean = false;
}
