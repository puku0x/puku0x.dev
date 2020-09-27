import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ScullyRoute, ScullyRoutesService } from '@scullyio/ng-lib';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent implements OnInit {
  posts$ = this.srs.available$.pipe(
    map((routeList) =>
      routeList.filter((route: ScullyRoute) =>
        route.route.startsWith(`/posts/`)
      )
    ),
    map((posts) => posts.sort((a, b) => (a.date > b.date ? -1 : 1)))
  );

  ngOnInit(): void {
    this.meta.updateTag({
      name: 'description',
      content:
        'Puku is a software developer, a big fan of Angular and the organizer of ng-fukuoka.',
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Puku is a software developer, a big fan of Angular and the organizer of ng-fukuoka.',
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'puku0x.net',
    });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({
      property: 'og:url',
      content: 'https://puku0x.net',
    });
    this.meta.updateTag({
      property: 'og:image',
      content: 'https://puku0x.net/assets/images/ogp.jpg',
    });
  }

  constructor(private meta: Meta, private srs: ScullyRoutesService) {}
}
