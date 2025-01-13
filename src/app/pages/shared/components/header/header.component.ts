import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() type: string = 'default';
  @Input() title: string;

  @Output() buttonBack = new EventEmitter();

  openedMenu = false;
}
