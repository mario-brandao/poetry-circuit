import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pics-carousel',
  templateUrl: './pics-carousel.component.html',
  styleUrls: ['./pics-carousel.component.scss'],
})
export class PicsCarouselComponent {
  @Input() images: { label: string; pic: string }[] = [];

  currentImageIndex = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images']) {
      const swiperContainer = document.querySelector('swiper-container');
      const swiperParams = {
        effect: 'cards',
        grabCursor: true,
        speed: 500,
        cardsEffect: {
          rotate: false,
        },
        mousewheel: {
          invert: false,
        },
        pagination: {
          enabled: true,
          dynamicBullets: true,
          clickable: true,
        },
        injectStyles: [
          `
          .swiper-pagination {
            position: relative;
            top: 10px !important;
          }

          .swiper-pagination-bullet {
            background-color: #DADADA;
            opacity: 1;
          }

          .swiper-pagination-bullet-active {
            background-color: #FF473A;
          }
          `,
        ],
      };
      Object.assign(swiperContainer, swiperParams);
      swiperContainer.initialize();
      swiperContainer.addEventListener('slidechange', () => {
        this.currentImageIndex = swiperContainer.swiper.activeIndex;
      });
    }
  }

  ngAfterViewInit(): void {}
}
