// navigation-tracker.service.ts
import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NavigationTrackerService {
  private _previousUrl: string | null = null;
  private _currentUrl: string | null = null;

  constructor(private router: Router) {
    this._currentUrl = this.router.url;
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: any) => {
        this._previousUrl = this._currentUrl;
        this._currentUrl = event.url;
      });
  }

  public get previousUrl(): string | null {
    return this._previousUrl;
  }
}
