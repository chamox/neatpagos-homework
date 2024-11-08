import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export const transactionAnimation = trigger('transactionAnimation', [
  state('void', style({ opacity: 0 })),
  transition(':enter, :leave', [
    animate('500ms ease-in-out', style({ opacity: 1 })),
  ]),
]);
