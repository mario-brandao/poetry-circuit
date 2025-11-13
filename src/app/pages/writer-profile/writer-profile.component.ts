import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScoreIncrementService } from 'src/app/services/score-increment.service';
import { StatuesService } from 'src/app/services/statues.service';
import { Statue } from 'src/app/shared/interfaces/statue.interface';

@Component({
  selector: 'app-writer-profile',
  templateUrl: './writer-profile.component.html',
  styleUrls: ['./writer-profile.component.scss'],
})
export class WriterProfileComponent implements OnInit {
  statue: Statue;
  showingBio = true;
  showCongrats = false;

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    private statuesService: StatuesService,
    private scoreIncrementService: ScoreIncrementService
  ) {}

  async ngOnInit(): Promise<void> {
    this.statue = await this.statuesService.getStatueData(
      this.route.snapshot.params.id
    );

    if (sessionStorage.getItem('showCongrats')) {
      this.showCongrats = true;
      sessionStorage.removeItem('showCongrats');
    }
  }

  closeCongrats(): void {
    this.scoreIncrementService.triggerIncrement();
    this.showCongrats = false;
  }

  toAugmentedReality(): void {
    this.router.navigate(['/augmented-reality', this.statue.normalizedName]);
  }
}
