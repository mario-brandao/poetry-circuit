import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ArImgDetectComponent } from './ar-img-detect/ar-img-detect.component';
import { ThreeAnimationAndTextureComponent } from './three-animation-and-texture/three-animation-and-texture.component';
import { ThreeCubeComponent } from './three-cube/three-cube.component';
import { ThreeGlbComponent } from './three-glb/three-glb.component';
import { ThreeObjComponent } from './three-obj/three-obj.component';

import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { MapComponent } from './pages/home/components/map/map.component';
import { SideMenuComponent } from './pages/shared/components/side-menu/side-menu.component';
import { HeaderComponent } from './pages/shared/components/header/header.component';
import { StatuesComponent } from './pages/home/components/statues/statues.component';
import { StatueCardComponent } from './pages/shared/components/statue-card/statue-card.component';
import { AlbumComponent } from './pages/album/album.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreeCubeComponent,
    ThreeObjComponent,
    ThreeGlbComponent,
    ThreeAnimationAndTextureComponent,
    ArImgDetectComponent,
    LandingComponent,
    HomeComponent,
    MapComponent,
    SideMenuComponent,
    HeaderComponent,
    StatuesComponent,
    StatueCardComponent,
    AlbumComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
