import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { gtag } from 'src/app/gtag';
import { ScoreService } from 'src/app/services/score.service';
import { StatuesService } from 'src/app/services/statues.service';
import { Statue } from 'src/app/shared/interfaces/statue.interface';
import { environment } from 'src/environments/environment';

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
    private scoreService: ScoreService
  ) {}

  async ngOnInit(): Promise<void> {
    this.statue = await this.statuesService.getStatueData(
      this.route.snapshot.params.id
    );
    if (!(await this.scoreService.hasStatuePoints(this.statue.id))) {
      gtag('event', 'start_mission', {
        writer_id: this.statue.id,
        send_to: environment.firebase.measurementId,
      });
    }
    setTimeout(() => {
      if (sessionStorage.getItem('showCongrats')) this.showCongrats = true;
    });
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('showCongrats');
  }

  get hasVisitedAnyPoems(): boolean {
    return this.statue?.poemsVisited.some((poem) => poem);
  }

  closeCongrats(): void {
    this.scoreService.onIncrementPoints$.next(
      Number(sessionStorage.getItem('showCongrats').split(',')[1])
    );
    sessionStorage.removeItem('showCongrats');
    this.showCongrats = false;
  }

  toAugmentedReality(): void {
    this.router.navigate(['/augmented-reality', this.statue.normalizedName]);
  }

  async openMoreInfo(): Promise<void> {
    if (!this.statue.moreInfoClicked) {
      await this.statuesService.markMoreInfoAsClicked(this.statue.id);
      this.statue.moreInfoClicked = true;
    }
    window.open(this.statue.moreInfoUrl, '_blank');
  }
}
