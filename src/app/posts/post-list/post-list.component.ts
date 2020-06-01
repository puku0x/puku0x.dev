import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent {
  posts$ = this.srs.available$.pipe(
    map((routeList) =>
      routeList.filter((route: ScullyRoute) =>
        route.route.startsWith(`/posts/`)
      )
    ),
    map((posts) => posts.sort((a, b) => (a.date > b.date ? -1 : 1)))
  );

  constructor(private srs: ScullyRoutesService) {}

  share(title?: string, url?: string) {
    const data = {
      title,
      url,
    };

    if ('share' in navigator) {
      navigator.share(data);
    }
  }
}
