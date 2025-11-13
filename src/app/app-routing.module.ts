import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthenticatedGuard } from './guards/is-authenticated.guard';
import { AlbumComponent } from './pages/album/album.component';
import { HomeComponent } from './pages/home/home.component';
import { LandingComponent } from './pages/landing/landing.component';
import { TutorialComponent } from './pages/tutorial/tutorial.component';
import { WriterProfileComponent } from './pages/writer-profile/writer-profile.component';

const routes: Routes = [
  {
    path: 'landing',
    component: LandingComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'album',
    component: AlbumComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'writer/:id',
    component: WriterProfileComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'tutorial',
    component: TutorialComponent,
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: 'augmented-reality',
    canActivate: [isAuthenticatedGuard],
    loadChildren: () =>
      import('./augmented-reality/augmented-reality.module').then(
        (m) => m.AugmentedRealityModule
      ),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
