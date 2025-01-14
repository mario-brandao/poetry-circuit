import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreeAnimationAndTextureComponent } from './augmented-reality/three-animation-and-texture/three-animation-and-texture.component';
import { AlbumComponent } from './pages/album/album.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { WritterProfileComponent } from './pages/writter-profile/writter-profile.component';

const routes: Routes = [
  {
    path: 'landing',
    component: LandingComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'album',
    component: AlbumComponent,
  },
  {
    path: 'writter/:id',
    component: WritterProfileComponent,
  },
  {
    path: 'monkey',
    component: ThreeAnimationAndTextureComponent,
  },
  {
    path: 'augmented-reality',
    loadChildren: () =>
      import('./augmented-reality/augmented-reality.module').then(
        (m) => m.AugmentedRealityModule
      ),
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
