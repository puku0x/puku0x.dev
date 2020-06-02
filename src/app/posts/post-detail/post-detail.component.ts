import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ScullyRoutesService } from '@scullyio/ng-lib';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class PostDetailComponent {
  post$ = this.srs.getCurrent().pipe(
    tap((route) => {
      this.meta.updateTag({ name: 'description', content: route.description });
      this.meta.updateTag({
        property: 'og:description',
        content: route.description,
      });
      this.meta.updateTag({
        property: 'og:title',
        content: route.title || route.route,
      });
      this.meta.updateTag({ property: 'og:type', content: 'article' });
      this.meta.updateTag({
        property: 'og:url',
        content: `https://puku0x.net${route.route}`,
      });
      this.meta.updateTag({ property: 'og:image', content: route.image });
    }),
    map((route) => ({
      title: route.title,
      date: route.date,
      description: route.description,
      image: route.image,
    }))
  );

  constructor(private meta: Meta, private srs: ScullyRoutesService) {}
}
