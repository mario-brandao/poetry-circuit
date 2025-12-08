import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { gtag } from 'src/app/gtag';
import { NavigationTrackerService } from 'src/app/services/navigation-tracker.service';
import { ScoreService } from 'src/app/services/score.service';
import { StatuesService } from 'src/app/services/statues.service';
import { UserService } from 'src/app/services/user.service';
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

  commingFromAR = false;

  showFormsAlert = false;

  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    private statuesService: StatuesService,
    private userService: UserService,
    private scoreService: ScoreService,
    private navigationTrackerService: NavigationTrackerService
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

    this.commingFromAR =
      this.navigationTrackerService.previousUrl?.includes('augmented-reality');

    combineLatest([
      this.statuesService.getStatuesWithProgress$(),
      this.userService.getUser(),
    ]).subscribe(([statuesProgress, user]) => {
      //TO CHANGE
      const selectedStatueProgress = statuesProgress.filter(
        (s) => s.id === 'ascenso-ferreira' || s.id === 'antonio-maria'
      );

      this.showFormsAlert =
        selectedStatueProgress.every((statue) => statue.visited) &&
        user?.data()?.clickedToAnswerForms === false &&
        this.commingFromAR;
    });
  }

  async ngOnDestroy(): Promise<void> {
    sessionStorage.removeItem('showCongrats');
    if (this.statue.isFirstReturn && this.commingFromAR) {
      await this.statuesService.updateIsFirstReturn(this.statue.id, false);
      this.statue.isFirstReturn = false;
    }
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

  async toForms(): Promise<void> {
    await this.userService.markClickedToAnswerForms();
    this.showFormsAlert = false;
    window.open('https://forms.gle/yBYwkcGiBUtnBqGs5', '_blank');
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
