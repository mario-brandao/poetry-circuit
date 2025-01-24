import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { firstAcessGuard } from './guards/first-acess.guard';
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
    canActivate: [firstAcessGuard],
  },
  {
    path: 'album',
    component: AlbumComponent,
    canActivate: [firstAcessGuard],
  },
  {
    path: 'writer/:id',
    component: WriterProfileComponent,
    canActivate: [firstAcessGuard],
  },
  {
    path: 'tutorial',
    component: TutorialComponent,
    canActivate: [firstAcessGuard],
  },
  {
    path: 'augmented-reality',
    canActivate: [firstAcessGuard],
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
