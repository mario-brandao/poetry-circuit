import { Component, Input } from '@angular/core';
import { Statue } from 'src/app/shared/interfaces/statue.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-statue-card',
  templateUrl: './statue-card.component.html',
  styleUrls: ['./statue-card.component.scss'],
})
export class StatueCardComponent {
  @Input() statue: Statue;

  getCover(): string {
    return `${environment.baseImgsUrl}/${this.statue.id}/cover.jpg`;
  }
}
