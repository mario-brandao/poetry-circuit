import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScoreIncrementService {
  private incrementSubject = new Subject<void>();
  public increment$ = this.incrementSubject.asObservable();

  triggerIncrement() {
    this.incrementSubject.next();
  }
}
