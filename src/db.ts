import Dexie, { Table } from 'dexie';
import writersData from './writers.json';

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
        name: writersData[0].name,
        cover: writersData[0].cover,
      },
      {
        name: writersData[1].name,
        cover: writersData[1].cover,
      },
      {
        name: writersData[2].name,
        cover: writersData[2].cover,
      },
      {
        name: writersData[3].name,
        cover: writersData[3].cover,
      },
      {
        name: writersData[4].name,
        cover: writersData[4].cover,
      },
      { name: writersData[5].name, cover: writersData[5].cover },
    ]);
  }
}

export const db = new AppDB();
