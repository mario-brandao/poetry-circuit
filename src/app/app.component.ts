import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { gtag } from './gtag';
import { IdleTimeService } from './services/idle-time.service';
import { NavigationTrackerService } from './services/navigation-tracker.service';
import { SessionResumeService } from './services/session-resume.service';
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
    protected sessionResumeService: SessionResumeService,
    private idleTimeService: IdleTimeService,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    const user = await this.userService.getUser();
    if (user?.exists()) {
      await this.userService.syncStatuesProgress();

      gtag('config', environment.firebase.measurementId, {
        user_id: user.id,
      });
      gtag('set', 'user_properties', {
        uid_visible: `uid_${user.id}`,
      });
    }
    this.idleTimeService.initialize();
  }
}
