import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  onIncrementPoints$: Subject<number> = new Subject();

  constructor(private firestore: Firestore) {}

  private getUid(): string | null {
    return localStorage.getItem('googleUid');
  }

  async getPoints(): Promise<number> {
    const uid = this.getUid();
    if (!uid) return;

    const pointsRef = doc(this.firestore, `users/${uid}/meta/points`);
    const snap = await getDoc(pointsRef);

    return snap.exists() ? snap.data()['value'] : 0;
  }

  async addPoints(statueId: string, points: number): Promise<void> {
    const uid = this.getUid();
    if (!uid) return;

    const entryRef = doc(
      this.firestore,
      `users/${uid}/scoreEntries/${statueId}`
    );
    const entrySnap = await getDoc(entryRef);

    if (entrySnap.exists()) return;

    await setDoc(entryRef, { points });

    const totalRef = doc(this.firestore, `users/${uid}/meta/points`);
    const totalSnap = await getDoc(totalRef);

    const newTotal =
      (totalSnap.exists() ? totalSnap.data()['value'] : 0) + points;

    await setDoc(totalRef, { value: newTotal });
  }

  async hasStatuePoints(statueId: string): Promise<boolean> {
    const uid = this.getUid();
    if (!uid) return false;

    const entryRef = doc(
      this.firestore,
      `users/${uid}/scoreEntries/${statueId}`
    );
    const snap = await getDoc(entryRef);

    return snap.exists();
  }
}
