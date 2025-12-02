import { Injectable } from '@angular/core';
import {
  collectionData,
  Firestore,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';
import { collection, doc, getDoc } from 'firebase/firestore';
import { combineLatest, firstValueFrom, map, Observable } from 'rxjs';
import { Statue } from 'src/app/shared/interfaces/statue.interface';
import { Poem } from '../shared/interfaces/poem.interface';

@Injectable({
  providedIn: 'root',
})
export class StatuesService {
  private statuesCollection = collection(this.firestore, 'writers');

  constructor(private firestore: Firestore) {}

  private getGoogleUid(): string {
    return localStorage.getItem('googleUid');
  }

  getStatues$(): Observable<Statue[]> {
    return collectionData(this.statuesCollection, {
      idField: 'id',
    }) as Observable<Statue[]>;
  }

  getUserProgress$(): Observable<any[]> {
    const uid = this.getGoogleUid();
    const ref = collection(this.firestore, `users/${uid}/progress`);
    return collectionData(ref, { idField: 'id' });
  }

  getStatuesWithProgress$(): Observable<any[]> {
    return combineLatest([this.getStatues$(), this.getUserProgress$()]).pipe(
      map(([writers, progress]) =>
        writers.map((writer) => {
          const writerProgress = progress.find(
            (p) => p.id === writer.normalizedName
          );
          return {
            ...writer,
            visited: writerProgress?.visited || false,
            poemsVisited: writerProgress?.poemsVisited || [],
          };
        })
      )
    );
  }

  async markStatueAsVisited(writerId: string): Promise<void> {
    const uid = this.getGoogleUid();
    const progressRef = doc(
      this.firestore,
      `users/${uid}/progress/${writerId}`
    );
    await setDoc(progressRef, { visited: true }, { merge: true });
  }

  async markPoemAsVisited(writerId: string, poemIndex: number): Promise<void> {
    const uid = this.getGoogleUid();
    const progressRef = doc(
      this.firestore,
      `users/${uid}/progress/${writerId}`
    );

    const current = await getDocs(
      collection(this.firestore, `users/${uid}/progress`)
    );
    const progress = current.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .find((p) => p.id === writerId);

    const poemsVisited = progress['poemsVisited'] || [];
    poemsVisited[poemIndex] = true;

    await setDoc(progressRef, { poemsVisited }, { merge: true });
  }

  async getStatueData(
    id: string
  ): Promise<
    | (Statue & { visited?: boolean; poemsVisited?: boolean[]; poems?: Poem[] })
    | undefined
  > {
    const uid = this.getGoogleUid();
    if (!uid) return undefined;

    const snapshot = await firstValueFrom(this.getStatues$());
    const statue = snapshot.find((s) => s.normalizedName === id);
    if (!statue) return undefined;

    const poemsColRef = collection(
      this.firestore,
      `writers/${statue.id}/poems`
    );
    const poemsSnap = await getDocs(poemsColRef);

    const poems: Poem[] = poemsSnap.docs.map((d) => {
      const data = d.data() as any;
      return data;
    });

    const progressRef = doc(
      this.firestore,
      `users/${uid}/progress/${statue.id}`
    );
    const progressSnap = await getDoc(progressRef);
    const progressData = progressSnap.exists()
      ? (progressSnap.data() as any)
      : {};

    const poemsVisited: boolean[] = progressData.poemsVisited ?? [];

    return {
      ...statue,
      poems,
      visited: !!progressData.visited,
      liked: progressData.liked,
      shared: progressData.shared,
      moreInfoClicked: progressData.moreInfoClicked,
      isFirstReturn: progressData.isFirstReturn,
      poemsVisited,
    };
  }

  async getStatueSettings(
    id: string,
    poemId: string
  ): Promise<
    { scale: number[]; rotation: number[]; position: number[] } | undefined
  > {
    const statue = await this.getStatueData(id);
    if (!statue) return undefined;

    const poem = statue.poems.find((p) => p.normalizedTitle === poemId);
    if (!poem) return undefined;

    const { scale, rotation, position } = poem;

    return { scale, rotation, position };
  }

  async markStatueAsLiked(writerId: string): Promise<void> {
    const uid = this.getGoogleUid();
    const progressRef = doc(
      this.firestore,
      `users/${uid}/progress/${writerId}`
    );
    await setDoc(progressRef, { liked: true }, { merge: true });
  }

  async markStatueAsShared(writerId: string): Promise<void> {
    const uid = this.getGoogleUid();
    const progressRef = doc(
      this.firestore,
      `users/${uid}/progress/${writerId}`
    );
    await setDoc(progressRef, { shared: true }, { merge: true });
  }

  async markMoreInfoAsClicked(writerId: string): Promise<void> {
    const uid = this.getGoogleUid();
    const progressRef = doc(
      this.firestore,
      `users/${uid}/progress/${writerId}`
    );
    await setDoc(progressRef, { moreInfoClicked: true }, { merge: true });
  }

  async updateIsFirstReturn(writerId: string, isFirstReturn): Promise<void> {
    const uid = this.getGoogleUid();
    const progressRef = doc(
      this.firestore,
      `users/${uid}/progress/${writerId}`
    );
    await setDoc(
      progressRef,
      { isFirstReturn: isFirstReturn },
      { merge: true }
    );
  }
}
