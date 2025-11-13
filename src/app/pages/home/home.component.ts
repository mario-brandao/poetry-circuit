import { Component } from '@angular/core';
import { StatuesService } from 'src/app/services/statues.service';
import { Statue } from 'src/app/shared/interfaces/statue.interface';

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
    this.statuesService.getStatuesWithProgress$().subscribe((statues) => {
      //======= TO CHANGE ========//
      this.statues = statues.filter(
        (statue) =>
          statue.id === 'antonio-maria' || statue.id === 'ascenso-ferreira'
      );
      this.visitedStatues = this.statues.filter((s) => s.visited);
      //======= ^^^^^^^^^^ ========//
      this.loadingRequests = false;
    });
  }
}
