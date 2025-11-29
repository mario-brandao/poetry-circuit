import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AudioService } from 'src/app/services/audio.service';
import { ScoreService } from 'src/app/services/score.service';

@Component({
  selector: 'app-score-bar',
  templateUrl: './score-bar.component.html',
  styleUrls: ['./score-bar.component.scss'],
})
export class ScoreBarComponent implements OnDestroy {
  private subscription: Subscription = new Subscription();
  public isARPage = false;
  public isLandingPage = false;

  public animatedPoints = 0;
  private incrementing = false;

  constructor(
    private router: Router,
    private audioService: AudioService,
    private scoreService: ScoreService
  ) {}

  async ngOnInit(): Promise<void> {
    this.checkIfNotShowPage();

    if (sessionStorage.getItem('showCongrats')) {
      this.animatedPoints = Number(
        sessionStorage.getItem('showCongrats').split(',')[0]
      );
    } else this.animatedPoints = await this.scoreService.getPoints();

    if (!this.isARPage) document.body.classList.add('score-bar-visible');
    else document.body.classList.remove('score-bar-visible');

    this.subscription.add(
      this.scoreService.onIncrementPoints$.subscribe((points) => {
        this.animatePoints(points);
      })
    );
  }

  ngAfterViewInit(): void {
    this.subscription.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          this.checkIfNotShowPage();
        })
    );
  }

  private checkIfNotShowPage(): void {
    this.isARPage = this.router.url.includes('/augmented-reality');
    this.isLandingPage = this.router.url.includes('/landing');

    if (this.isARPage || this.isLandingPage) {
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
