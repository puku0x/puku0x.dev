import {
  trigger,
  animate,
  transition,
  style,
  query,
} from '@angular/animations';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

export const fadeInAnimation = trigger('fadeInAnimation', [
  transition('* => *', [
    query(
      ':enter',
      [style({ opacity: 0 }), animate('250ms', style({ opacity: 1 }))],
      { optional: true }
    ),
  ]),
]);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeInAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  getRouterOutletState(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
