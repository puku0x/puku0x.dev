import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FooterComponent, HeaderComponent, MainComponent } from './components';
import { RouterModule } from '@angular/router';

const components = [FooterComponent, HeaderComponent, MainComponent];

@NgModule({
  imports: [CommonModule, RouterModule, MatButtonModule, MatToolbarModule],
  exports: [...components],
  declarations: [...components],
})
export class SharedModule {}
