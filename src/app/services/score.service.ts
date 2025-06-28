import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ScoreEntry {
  statueId: number;
  points: number;
}

@Injectable({ providedIn: 'root' })
export class ScoreService extends Dexie {
  scoreEntries!: Table<ScoreEntry, number>;
  userPoints!: Table<{ id: number; points: number }, number>;

  private pointsSubject = new BehaviorSubject<number>(0);
  public points$: Observable<number> = this.pointsSubject.asObservable();

  constructor() {
    super('scoreDB');
    this.version(1).stores({
      scoreEntries: '++statueId',
      userPoints: 'id',
    });
    this.initializePoints();
  }

  private async initializePoints(): Promise<void> {
    const points = await this.getPoints();
    this.pointsSubject.next(points);
  }

  async addPoints(statueId: number, points: number): Promise<void> {
    const already = await this.scoreEntries.get(statueId);
    if (already) {
      return;
    }

    await this.scoreEntries.add({ statueId, points });
    const user = await this.userPoints.get(1);
    if (user) {
      const newPoints = user.points + points;
      await this.userPoints.update(1, { points: newPoints });
      this.pointsSubject.next(newPoints);
    } else {
      await this.userPoints.add({ id: 1, points });
      this.pointsSubject.next(points);
    }
  }

  async getPoints(): Promise<number> {
    const user = await this.userPoints.get(1);
    return user ? user.points : 0;
  }

  async hasStatuePoints(statueId: number): Promise<boolean> {
    return !!(await this.scoreEntries.get(statueId));
  }

  public get points(): number {
    return this.pointsSubject.getValue();
  }
}
