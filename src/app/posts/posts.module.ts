import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ScullyLibModule } from '@scullyio/ng-lib';

import { PostListComponent } from './post-list/post-list.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostsRoutingModule } from './posts-routing.module';

@NgModule({
  declarations: [PostListComponent, PostDetailComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    PostsRoutingModule,
    ScullyLibModule,
  ],
})
export class PostsModule {}
