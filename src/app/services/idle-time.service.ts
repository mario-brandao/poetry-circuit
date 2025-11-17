import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { gtag } from '../gtag';

@Injectable({
  providedIn: 'root',
})
export class IdleTimeService {
  private idleStart: number | null = null;
  private idleTimeout: any;

  private readonly IDLE_THRESHOLD_MS = 10_000;

  constructor(private ngZone: NgZone) {}

  initialize() {
    this.startTracking();
  }

  private startTracking() {
    const events = ['mousemove', 'keydown', 'touchstart', 'scroll'];

    events.forEach((ev) => {
      window.addEventListener(ev, () => this.onUserActivity(), {
        passive: true,
      });
    });

    this.startIdleTimer();
  }

  private onUserActivity() {
    const now = Date.now();

    if (this.idleStart !== null) {
      const idleDuration = now - this.idleStart;

      if (idleDuration >= this.IDLE_THRESHOLD_MS) {
        this.sendIdleEvent(idleDuration);
      }
    }

    this.resetIdleTimer();
  }

  private startIdleTimer() {
    this.idleStart = Date.now();
  }

  private resetIdleTimer() {
    this.idleStart = Date.now();
    clearTimeout(this.idleTimeout);

    this.idleTimeout = setTimeout(() => {
      this.idleStart = Date.now();
    }, this.IDLE_THRESHOLD_MS);
  }

  private sendIdleEvent(durationMs: number) {
    try {
      gtag('event', 'idle_time', {
        idle_duration_msec: durationMs,
        send_to: environment.firebase.measurementId,
      });
    } catch (e) {
      console.warn('gtag not available', e);
    }
  }
}
