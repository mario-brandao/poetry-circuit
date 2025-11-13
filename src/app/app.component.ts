import { Component } from '@angular/core';
import { gtag } from './gtag';
import { NavigationTrackerService } from './services/navigation-tracker.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'poetry-circuit';

  constructor(
    protected navTracker: NavigationTrackerService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    const user = await this.userService.getUser();
    if (user?.exists()) {
      await this.userService.syncStatuesProgress();

      gtag('config', 'G-39WWT3C14M', {
        user_id: user.id,
      });
      gtag('set', 'user_properties', {
        uid_visible: `uid_${user.id}`,
      });
    }
  }
}
