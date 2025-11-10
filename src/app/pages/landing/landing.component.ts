import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { db } from 'src/db';

declare var google: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {
    window.onload = () => {
      this.initializeGoogleSignIn();
    };
  }

  initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id:
        '289710175954-dp3isc2ufmr7lg8mbf6fka903ellc5i5.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    google.accounts.id.renderButton(document.getElementById('googleBtn'), {
      type: 'standard',
    });
  }

  handleCredentialResponse(response: any): void {
    const token = response.credential;
    const payload = JSON.parse(atob(token.split('.')[1]));

    console.log('Google UID:', payload.sub);
    console.log('Nome:', payload.name);
    console.log('Email:', payload.email);
  }

  async toFirstAccess(): Promise<void> {
    const user = await db.user.get(1);
    if (user?.firstAccess) {
      this.router.navigate(['/tutorial']);
      return;
    }
    this.router.navigate(['/home']);
  }

  onGoogleLoginClicked(): void {}
}
