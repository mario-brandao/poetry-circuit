import { Component, Input } from '@angular/core';
import { Statue } from 'src/app/shared/interfaces/statue.interface';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pics-carousel',
  templateUrl: './pics-carousel.component.html',
  styleUrls: ['./pics-carousel.component.scss'],
})
export class PicsCarouselComponent {
  @Input() statue: Statue;

  images: string[] = [];
  currentImageIndex = 0;

  ngOnInit(): void {
    this.images = Array.from(
      { length: this.statue.imgsAmount },
      (_, i) => `${environment.baseImgsUrl}/${this.statue.id}/pics/${i + 1}.jpg`
    );

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
