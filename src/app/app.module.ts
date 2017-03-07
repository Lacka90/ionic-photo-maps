import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PhotoPage } from '../pages/photo/photo';
import { MapsPage } from '../pages/maps/maps';
import { PhotoStorage } from '../services/storage';
import { AuthService } from '../services/auth';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PhotoPage,
    MapsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PhotoPage,
    MapsPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    PhotoStorage,
    AuthService
  ]
})
export class AppModule {}
