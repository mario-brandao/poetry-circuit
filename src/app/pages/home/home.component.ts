import { Component } from '@angular/core';
import { combineLatest } from 'rxjs';
import { StatuesService } from 'src/app/services/statues/statues.service';
import { Statue } from 'src/db';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  statues: Statue[];
  visitedStatues: Statue[];

  loadingRequests = false;

  constructor(private statuesService: StatuesService) {}

  ngOnInit(): void {
    this.loadingRequests = true;
    combineLatest([
      this.statuesService.statues$,
      this.statuesService.visitedStatues$,
    ]).subscribe({
      next: ([statues, visitedStatues]) => {
        this.statues = [statues[0], statues[1]];
        this.visitedStatues = visitedStatues;
        this.loadingRequests = false;
      },
    });
  }
}
