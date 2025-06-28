import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { db } from 'src/db';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  constructor(private router: Router) {}

  async toFirstAccess(): Promise<void> {
    const user = await db.user.get(1);
    if (user?.firstAccess) {
      this.router.navigate(['/tutorial']);
      return;
    }
    this.router.navigate(['/home']);
  }
}
