import { Component, Input } from '@angular/core';
import { Statue } from 'src/app/shared/interfaces/statue.interface';

@Component({
  selector: 'app-statues',
  templateUrl: './statues.component.html',
  styleUrls: ['./statues.component.scss'],
})
export class StatuesComponent {
  @Input() statues: Statue[];
  @Input() visitedStatues: Statue[];
}
