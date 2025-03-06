import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { register } from 'swiper/element/bundle';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { GoogleMapsModule } from '@angular/google-maps';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { AlbumComponent } from './pages/album/album.component';
import { MapComponent } from './pages/home/components/map/map.component';
import { StatuesComponent } from './pages/home/components/statues/statues.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { HeaderComponent } from './pages/shared/components/header/header.component';
import { SideMenuComponent } from './pages/shared/components/side-menu/side-menu.component';
import { StatueCardComponent } from './pages/shared/components/statue-card/statue-card.component';
import { TutorialComponent } from './pages/tutorial/tutorial.component';
import { PicsCarouselComponent } from './pages/writer-profile/pics-carousel/pics-carousel.component';
import { WriterProfileComponent } from './pages/writer-profile/writer-profile.component';

register();

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    HomeComponent,
    MapComponent,
    SideMenuComponent,
    HeaderComponent,
    StatuesComponent,
    StatueCardComponent,
    AlbumComponent,
    WriterProfileComponent,
    PicsCarouselComponent,
    TutorialComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
