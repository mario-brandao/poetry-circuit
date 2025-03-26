import Dexie, { Table } from 'dexie';
import writersData from './writers.json';

export interface Statue {
  id: number;
  name: string;
  normalizedName: string;
  location: string;
  coordinates: string[];
  subtitle: string;
  rangeLife: string;
  visited: boolean;
  bio: string;
  poems: Poem[];
  images: { label: string; pic: string }[];
  cover: string;
}

export interface Poem {
  title: string;
  normalizedTitle: string;
  visited: boolean;
}

export interface User {
  id: number;
  firstAccess: boolean;
}

export class AppDB extends Dexie {
  // Initially partial Statue for lack of id
  statues!: Table<Statue, number>;
  user!: Table<User, number>;

  constructor() {
    super('ngdexieliveQuery');
    this.version(1).stores({
      statues: '++id',
      user: 'id',
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    await db.statues.bulkAdd(writersData as any);

    await db.user.add({
      id: 1,
      firstAccess: true,
    });
  }

  async updateStatueData(id: number, statue: Partial<Statue>) {
    await db.statues.update(id, statue);
  }
}

export const db = new AppDB();
