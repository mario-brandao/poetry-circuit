import Dexie, { Table } from 'dexie';
import writtersData from './writters.json';

export interface Statue {
  cover: string;
  name: string;
}

export class AppDB extends Dexie {
  statues!: Table<Statue, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(1).stores({
      statues: '++id',
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    await db.statues.bulkAdd([
      {
        name: writtersData[0].name,
        cover: writtersData[0].cover,
      },
      {
        name: writtersData[1].name,
        cover: writtersData[1].cover,
      },
      {
        name: writtersData[2].name,
        cover: writtersData[2].cover,
      },
      {
        name: writtersData[3].name,
        cover: writtersData[3].cover,
      },
      {
        name: writtersData[4].name,
        cover: writtersData[4].cover,
      },
      { name: writtersData[5].name, cover: writtersData[5].cover },
    ]);
  }
}

export const db = new AppDB();
