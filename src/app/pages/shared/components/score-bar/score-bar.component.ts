import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AudioService } from 'src/app/services/audio.service';
import { ScoreIncrementService } from 'src/app/services/score-increment.service';
import { ScoreService } from 'src/app/services/score.service';

@Component({
  selector: 'app-score-bar',
  templateUrl: './score-bar.component.html',
  styleUrls: ['./score-bar.component.scss'],
})
export class ScoreBarComponent implements OnDestroy {
  public points$ = this.scoreService.points$;
  private subscription: Subscription = new Subscription();
  public isARPage = false;

  public animatedPoints = 0;
  private incrementing = false;
  private lastTarget = 0;

  constructor(
    private scoreService: ScoreService,
    private router: Router,
    private audioService: AudioService,
    private scoreIncrementService: ScoreIncrementService
  ) {
    this.checkIfARPage();

    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.checkIfARPage();
        })
    );

    this.subscription.add(
      this.points$.subscribe((points) => {
        if (points > 0 && !this.isARPage) {
          document.body.classList.add('score-bar-visible');
        } else {
          document.body.classList.remove('score-bar-visible');
        }
        if (points < this.animatedPoints) {
          this.animatedPoints = points;
        }
        this.lastTarget = points;
      })
    );

    this.subscription.add(
      this.scoreIncrementService.increment$.subscribe(() => {
        this.points$
          .subscribe((points) => {
            if (points > this.animatedPoints) {
              this.animatePoints(points);
            }
          })
          .unsubscribe();
      })
    );
  }

  private checkIfARPage(): void {
    this.isARPage = this.router.url.includes('/augmented-reality');

    if (this.isARPage) {
      document.body.classList.add('ar-page');
    } else {
      document.body.classList.remove('ar-page');
    }
  }

  private animatePoints(target: number) {
    if (this.incrementing) return;
    if (target === this.animatedPoints) return;
    if (target < this.animatedPoints) {
      this.animatedPoints = target;
      return;
    }
    this.incrementing = true;
    this.audioService.playCoinsSound();
    const duration = 1200; // ms
    const start = this.animatedPoints;
    const diff = target - start;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      this.animatedPoints = Math.floor(start + diff * progress);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.animatedPoints = target;
        this.incrementing = false;
      }
    };
    requestAnimationFrame(step);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    document.body.classList.remove('score-bar-visible');
    document.body.classList.remove('ar-page');
  }
}
