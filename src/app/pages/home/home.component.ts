import { Component } from '@angular/core';
import { Observable } from 'dexie';
import { StatuesService } from 'src/app/services/statues/statues.service';
import { Statue } from 'src/db';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  statues$: Observable<Statue[]>;
  visitedStatues$: Observable<Statue[]>;

  constructor(private statuesService: StatuesService) {}

  ngOnInit(): void {
    this.statues$ = this.statuesService.statues$;
    this.visitedStatues$ = this.statuesService.visitedStatues$;
  }
}
