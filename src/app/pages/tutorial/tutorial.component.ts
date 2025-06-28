import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationTrackerService } from 'src/app/services/navigation-tracker/navigation-tracker.service';
import { db } from 'src/db';
import { SwiperContainer } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent implements OnInit {
  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  swiperConfig: SwiperOptions = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  currentIndex = 0;
  isFirstAccess = null;
  previousRoute: string | null = null;

  constructor(
    private router: Router,
    private navTracker: NavigationTrackerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.previousRoute = this.navTracker.previousUrl;
    this.isFirstAccess = (await db.user.get(1)).firstAccess;
  }

  slideChange(swiper: any): void {
    this.currentIndex = swiper.detail[0].activeIndex;
  }

  nextSlide(): void {
    const swiperInstance = this.swiper.nativeElement.swiper;
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  }

  skip(): void {
    const swiperInstance = this.swiper.nativeElement.swiper;
    if (swiperInstance) {
      swiperInstance.slideTo(3);
    }
  }

  toHome(): void {
    if (this.isFirstAccess) {
      db.user.update(1, { firstAccess: false });
    }
    this.router.navigate(['/home']);
  }

  toPreviousRoute(): void {
    if (this.previousRoute) this.router.navigate([this.previousRoute]);
    else this.router.navigate(['/home']);
  }
}
