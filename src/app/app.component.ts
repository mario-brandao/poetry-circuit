import { Component } from '@angular/core';
import { NavigationTrackerService } from './services/navigation-tracker/navigation-tracker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'poetry-circuit';

  constructor(protected navTracker: NavigationTrackerService) {}
}
