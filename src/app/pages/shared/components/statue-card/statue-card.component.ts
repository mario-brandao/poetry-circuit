import { Component, Input } from '@angular/core';
import { Statue } from 'src/db';

@Component({
  selector: 'app-statue-card',
  templateUrl: './statue-card.component.html',
  styleUrls: ['./statue-card.component.scss'],
})
export class StatueCardComponent {
  @Input() statue: Statue;
}
