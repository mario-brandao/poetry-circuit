import { AfterViewInit, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { gtag } from 'src/app/gtag';
import { db } from 'src/db';

declare var google: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements AfterViewInit {
  constructor(private router: Router, private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.tryInitializeGoogleSignIn();
  }

  private tryInitializeGoogleSignIn(retryCount = 0): void {
    if (typeof google === 'undefined' || !google.accounts?.id) {
      if (retryCount < 10) {
        setTimeout(() => this.tryInitializeGoogleSignIn(retryCount + 1), 300);
      } else {
        console.error('Google Sign-In script not loaded after retries.');
      }
      return;
    }

    this.initializeGoogleSignIn();
  }

  private initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id:
        '289710175954-dp3isc2ufmr7lg8mbf6fka903ellc5i5.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });

    const button = document.getElementById('googleBtn');
    if (button) {
      google.accounts.id.renderButton(button, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
      });
    } else {
      console.warn('Elemento #googleBtn não encontrado.');
    }
  }

  async handleCredentialResponse(response: any): Promise<void> {
    const token = response.credential;
    const payload = JSON.parse(atob(token.split('.')[1]));

    await db.user.update(1, { googleUid: payload.sub });
    const user = await db.user.get(1);

    gtag('config', 'G-39WWT3C14M', { user_id: user.googleUid });
    gtag('set', 'user_properties', { uid_visible: `uid_${user.googleUid}` });

    this.zone.run(() => {
      if (user?.firstAccess) this.router.navigate(['/tutorial']);
      else this.router.navigate(['/home']);
    });
  }
}
