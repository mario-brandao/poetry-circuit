import { Component, OnInit } from '@angular/core';
import { Observable } from 'dexie';
import { StatuesService } from 'src/app/services/statues/statues.service';
import { Statue } from 'src/db';

@Component({
  selector: 'app-statues',
  templateUrl: './statues.component.html',
  styleUrls: ['./statues.component.scss'],
})
export class StatuesComponent implements OnInit {
  statues$: Observable<Statue[]>;
  visitedStatues$: Observable<Statue[]>;

  hasVisitedStatues = false;

  constructor(private statuesService: StatuesService) {}

  ngOnInit(): void {
    this.statues$ = this.statuesService.statues$;
    this.visitedStatues$ = this.statuesService.visitedStatues$;

    this.visitedStatues$.subscribe(
      (statues) => (this.hasVisitedStatues = statues.length > 0)
    );
  }
}
