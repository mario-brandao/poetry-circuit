import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';
import { firstValueFrom } from 'rxjs';
import { db, Statue } from 'src/db';

@Injectable({
  providedIn: 'root',
})
export class StatuesService {
  statues$ = liveQuery(() => db.statues.toArray());
  visitedStatues$ = liveQuery(() =>
    db.statues.filter((statue) => statue.visited).toArray()
  );

  constructor() {}

  async getStatueData(id: number): Promise<Statue | undefined> {
    const statues: Statue[] = await firstValueFrom(this.statues$ as any);
    return statues.find((statue) => statue['id'] === id);
  }

  async getStatueByNormalizedName(
    normalizedName: string
  ): Promise<Statue | undefined> {
    const statues: Statue[] = await firstValueFrom(this.statues$ as any);
    return statues.find(
      (statue) => statue['normalizedName'] === normalizedName
    );
  }

  async getStatueSettings(
    writterName: string,
    poemTitle: string
  ): Promise<
    { scale: number[]; rotation: number[]; position: number[] } | undefined
  > {
    const statues: Statue[] = await firstValueFrom(this.statues$ as any);
    const writter = statues.find(
      (statue) => statue['normalizedName'] === writterName
    );

    const { scale, rotation, position } = writter.poems.find(
      (statue) => statue['normalizedTitle'] === poemTitle
    );
    return { scale, rotation, position };
  }

  async markAsVisited(id: number, visited = true): Promise<void> {
    await db.updateStatueData(id, { visited });
  }

  async markPoemAsVisited(
    id: number,
    poemIndex: number,
    visited = true
  ): Promise<void> {
    const statue = await this.getStatueData(id);
    if (!statue) {
      return;
    }
    statue.poems[poemIndex].visited = visited;
    await db.updateStatueData(id, { poems: statue.poems });
  }
}
