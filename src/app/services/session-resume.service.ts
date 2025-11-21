// session-resume.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

declare const gtag: (...args: any[]) => void;

@Injectable({ providedIn: 'root' })
export class SessionResumeService implements OnDestroy {
  private subs: Subscription[] = [];
  private STORAGE_KEY = 'pcdp_last_hidden_at';
  private THRESHOLD_MS = 5 * 60 * 1000;

  initialize(): void {
    // visibilitychange
    this.subs.push(
      fromEvent(document, 'visibilitychange').subscribe(() =>
        this.onVisibilityChange()
      )
    );
    // focus/blur
    this.subs.push(fromEvent(window, 'focus').subscribe(() => this.onFocus()));
    this.subs.push(fromEvent(window, 'blur').subscribe(() => this.onBlur()));
    // pagehide
    this.subs.push(
      fromEvent(window, 'pagehide').subscribe(() => this.onHidden())
    );
  }

  private now() {
    return Date.now();
  }

  private onHidden() {
    sessionStorage.setItem(this.STORAGE_KEY, String(this.now()));
  }

  private onBlur() {
    sessionStorage.setItem(this.STORAGE_KEY, String(this.now()));
  }

  private onVisibilityChange() {
    if (document.hidden) {
      sessionStorage.setItem(this.STORAGE_KEY, String(this.now()));
    } else {
      this.handleResume();
    }
  }

  private onFocus() {
    this.handleResume();
  }

  private handleResume() {
    const last = sessionStorage.getItem(this.STORAGE_KEY);
    if (!last) return;
    const lastTs = Number(last);
    if (!lastTs || isNaN(lastTs)) return;

    const pauseDuration = this.now() - lastTs;

    sessionStorage.removeItem(this.STORAGE_KEY);

    this.sendResumeEvent(pauseDuration);
  }

  private sendResumeEvent(pauseDurationMs: number) {
    const isQuick = pauseDurationMs <= this.THRESHOLD_MS;

    try {
      gtag('event', 'session_resume', {
        pause_duration_msec: pauseDurationMs,
        session_resume_quick: isQuick ? 'true' : 'false',
        send_to: environment.firebase.measurementId,
      });
    } catch (e) {
      console.warn('gtag not available', e);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }
}
