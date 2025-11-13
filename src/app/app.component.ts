import { Component } from '@angular/core';
import { db } from 'src/db';
import { gtag } from './gtag';
import { NavigationTrackerService } from './services/navigation-tracker/navigation-tracker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'poetry-circuit';

  constructor(protected navTracker: NavigationTrackerService) {}

  async ngOnInit(): Promise<void> {
    const user = await db.user.get(1);
    if (!user)
      await db.user.add({ id: 1, googleUid: undefined, firstAccess: true });
    else if (user?.googleUid) {
      gtag('config', 'G-39WWT3C14M', {
        user_id: user.googleUid,
      });
      gtag('set', 'user_properties', {
        uid_visible: `uid_${user.googleUid}`,
      });
    }
  }
}
