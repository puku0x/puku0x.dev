import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ScullyRoutesService, ScullyRoute } from '@scullyio/ng-lib';
import { combineLatest, map, shareReplay, take } from 'rxjs';

import { Post } from '../../models';

const toPost = (route: ScullyRoute): Post => ({
  title: route.title || route.route,
  date: route.date,
  categories: route.categories,
  description: route.description,
  image: route.image,
  route: route.route,
});

@Component({
  selector: 'app-post',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class PostDetailComponent implements OnInit {
  posts$ = this.srs.available$.pipe(
    map((routeList) =>
      routeList.filter((route) => route.route.startsWith(`/posts/`))
    ),
    map((posts) =>
      posts.sort((a, b) => (a.date > b.date ? -1 : 1)).map(toPost)
    ),
    shareReplay(1)
  );

  post$ = this.srs.getCurrent().pipe(map(toPost), shareReplay(1));

  nextPost$ = combineLatest([this.posts$, this.post$]).pipe(
    map(([posts, post]) => {
      const index = posts.findIndex((p) => p.route === post.route);
      if (index > 0) {
        return posts[index - 1];
      }
      return undefined;
    })
  );

  prevPost$ = combineLatest([this.posts$, this.post$]).pipe(
    map(([posts, post]) => {
      const index = posts.findIndex((p) => p.route === post.route);
      if (-1 < index && index < posts.length - 1) {
        return posts[index + 1];
      }
      return undefined;
    })
  );

  constructor(private meta: Meta, private srs: ScullyRoutesService) {}

  ngOnInit(): void {
    this.post$.pipe(take(1)).subscribe((post) => {
      this.meta.updateTag({
        name: 'description',
        content: post.description,
      });
      this.meta.updateTag({
        property: 'og:description',
        content: post.description,
      });
      this.meta.updateTag({
        property: 'og:title',
        content: post.title,
      });
      this.meta.updateTag({ property: 'og:type', content: 'article' });
      this.meta.updateTag({
        property: 'og:url',
        content: `https://puku0x.dev${post.route}`,
      });
      this.meta.updateTag({ property: 'og:image', content: post.image });
    });
  }
}
