import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';
import { firstValueFrom } from 'rxjs';
import { db, Statue } from 'src/db';

@Injectable({
  providedIn: 'root',
})
export class StatuesService {
  statues$ = liveQuery(() => db.statues.toArray());

  constructor() {}

  async getStatueData(id: number): Promise<Statue | undefined> {
    const statues: Statue[] = await firstValueFrom(this.statues$ as any);
    return statues.find((statue) => statue['id'] === id);
  }
}
