import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { AlbumComponent } from './pages/album/album.component';
import { MapComponent } from './pages/home/components/map/map.component';
import { StatuesComponent } from './pages/home/components/statues/statues.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { HeaderComponent } from './pages/shared/components/header/header.component';
import { SideMenuComponent } from './pages/shared/components/side-menu/side-menu.component';
import { StatueCardComponent } from './pages/shared/components/statue-card/statue-card.component';

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
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
