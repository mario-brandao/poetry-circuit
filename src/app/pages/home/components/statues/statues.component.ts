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

  constructor(private statuesService: StatuesService) {}

  ngOnInit(): void {
    this.statues$ = this.statuesService.statues$;
    this.statues$.subscribe((statues) => {
      console.log(statues);
    });
  }
}
