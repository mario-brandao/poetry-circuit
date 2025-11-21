import { Component } from '@angular/core';
import { AnalyticsService } from './services/analytics.service';
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
    private analyticsService: AnalyticsService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    const user = await this.userService.getUser();
    if (user?.exists()) {
      await this.userService.syncStatuesProgress();
      this.analyticsService.start(user.id);
    }
  }
}
