import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThreeCubeComponent } from './three-cube/three-cube.component';
import { ThreeObjComponent } from './three-obj/three-obj.component';
import { ThreeGlbComponent } from './three-glb/three-glb.component';
import { ThreeAnimationAndTextureComponent } from './three-animation-and-texture/three-animation-and-texture.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreeCubeComponent,
    ThreeObjComponent,
    ThreeGlbComponent,
    ThreeAnimationAndTextureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
