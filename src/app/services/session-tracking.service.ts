import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionTrackingService {
  private sessionStartTime: number | null = null;

  constructor() {
    window.addEventListener('beforeunload', () => this.endSession());
  }

  startSession(): void {
    if (this.sessionStartTime !== null) {
      return;
    }

    this.sessionStartTime = Date.now();
  }

  endSession(): void {
    if (this.sessionStartTime === null) return;

    const endTime = Date.now();
    const durationMs = endTime - this.sessionStartTime;

    this.sessionStartTime = null;
  }
}
