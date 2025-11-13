import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationTrackerService } from 'src/app/services/navigation-tracker.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/interfaces/user.interface';
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
  previousRoute: string | null = null;

  user: User;

  constructor(
    private router: Router,
    private navTracker: NavigationTrackerService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    this.previousRoute = this.navTracker.previousUrl;
    this.user = <User>(await this.userService.getUser()).data();
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

  async toHome(): Promise<void> {
    if (this.user.firstAccess) {
      await this.userService.markIsNotFirstAccess();
    }
    this.router.navigate(['/home']);
  }

  toPreviousRoute(): void {
    if (this.previousRoute) this.router.navigate([this.previousRoute]);
    else this.router.navigate(['/home']);
  }
}
