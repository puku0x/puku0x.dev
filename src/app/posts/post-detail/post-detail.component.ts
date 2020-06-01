import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class PostDetailComponent {
  post$ = this.srs.getCurrent().pipe(
    map((route) => ({
      title: route.title,
      date: route.date,
      description: route.description,
      image: route.image,
    }))
  );
  constructor(private srs: ScullyRoutesService) {}
}
