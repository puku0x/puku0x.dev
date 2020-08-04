import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { ScullyLibModule } from '@scullyio/ng-lib';

// import { environment } from '../environments/environment';
import { SharedModule } from './shared';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: environment.production,
    // }),
    // ScullyLibModule.forRoot({
    //   useTransferState: true,
    //   alwaysMonitor: true,
    // }),
    ScullyLibModule,
    SharedModule,
    AppRoutingModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
