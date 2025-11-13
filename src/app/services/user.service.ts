import { Injectable } from '@angular/core';
import { Firestore, updateDoc, writeBatch } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import {
  collection,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestore: Firestore, private router: Router) {}

  private getGoogleUid(): string {
    return localStorage.getItem('googleUid');
  }

  async getUser(): Promise<DocumentSnapshot | null> {
    const uid = this.getGoogleUid();
    if (uid) {
      const userRef = doc(this.firestore, 'users', uid);
      return await getDoc(userRef);
    }
    return null;
  }

  async createUser(): Promise<void> {
    const uid = this.getGoogleUid();
    const userRef = doc(this.firestore, 'users', uid);
    await setDoc(userRef, {
      firstAccess: true,
      createdAt: new Date(),
    });
  }

  async markIsNotFirstAccess(): Promise<void> {
    const uid = this.getGoogleUid();
    const userRef = doc(this.firestore, 'users', uid);
    await updateDoc(userRef, {
      firstAccess: false,
    });
  }

  async syncStatuesProgress(): Promise<void> {
    const uid = this.getGoogleUid();

    const writersSnap = await getDocs(collection(this.firestore, 'writers'));
    const writers = writersSnap.docs.map((d) => ({
      id: d.id,
      poems: d.data()['poems'] || [],
    }));

    const progressSnap = await getDocs(
      collection(this.firestore, `users/${uid}/progress`)
    );
    const existing = progressSnap.docs.map((d) => d.id);

    const batch = writeBatch(this.firestore);
    writers.forEach((writer) => {
      if (!existing.includes(writer.id)) {
        const progressRef = doc(
          this.firestore,
          `users/${uid}/progress/${writer.id}`
        );
        batch.set(progressRef, {
          visited: false,
          poemsVisited: new Array(writer.poems.length).fill(false),
          updatedAt: new Date(),
        });
      }
    });

    await batch.commit();
  }

  logout(): void {
    localStorage.removeItem('googleUid');
    setTimeout(() => {
      window.location.reload();
    });
  }
}
