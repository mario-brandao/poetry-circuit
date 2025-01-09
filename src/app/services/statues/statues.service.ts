import { Injectable } from '@angular/core';
import { liveQuery } from 'dexie';
import { db } from 'src/db';

@Injectable({
  providedIn: 'root',
})
export class StatuesService {
  statues$ = liveQuery(() => db.statues.toArray());

  constructor() {}
}
