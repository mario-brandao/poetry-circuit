import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const overlayAnimations = [
  trigger('fadeOut', [
    transition(':leave', [animate('1s ease-in-out', style({ opacity: 0 }))]),
  ]),
  trigger('progressAnimation', [
    transition(':increment', [
      animate(
        '0.3s ease-in-out',
        keyframes([style({ width: '0%' }), style({ width: '{{progress}}%' })])
      ),
    ]),
  ]),
];
