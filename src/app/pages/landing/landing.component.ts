import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { gtag } from 'src/app/gtag';
import { db } from 'src/db';

declare var google: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  constructor(private router: Router, private zone: NgZone) {}

  ngAfterViewInit(): void {
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

  async handleCredentialResponse(response: any): Promise<void> {
    const token = response.credential;
    const payload = JSON.parse(atob(token.split('.')[1]));

    await db.user.update(1, { googleUid: payload.sub });
    const user = await db.user.get(1);

    gtag('config', 'G-39WWT3C14M', {
      user_id: user.googleUid,
    });

    gtag('set', 'user_properties', {
      uid_visible: `uid_${user.googleUid}`,
    });

    this.zone.run(() => {
      if (user?.firstAccess) this.router.navigate(['/tutorial']);
      else this.router.navigate(['/home']);
    });
  }

  onGoogleLoginClicked(): void {}
}
