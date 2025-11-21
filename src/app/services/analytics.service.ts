// session-resume.service.ts
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IdleTimeService } from './idle-time.service';
import { SessionResumeService } from './session-resume.service';
import { SessionTrackingService } from './session-tracking.service';
import { UserService } from './user.service';

declare const gtag: (...args: any[]) => void;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(
    private sessionTrackingService: SessionTrackingService,
    private sessionResumeService: SessionResumeService,
    private idleTimeService: IdleTimeService,
    private userService: UserService
  ) {}

  async start(userId): Promise<void> {
    gtag('config', environment.firebase.measurementId, {
      user_id: userId,
    });
    gtag('set', 'user_properties', {
      uid_visible: `uid_${userId}`,
    });

    this.sessionTrackingService.startSession();
    this.sessionResumeService.initialize();
    this.idleTimeService.initialize();
  }
}
