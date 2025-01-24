import Dexie, { Table } from 'dexie';
import writersData from './writers.json';

export interface Statue {
  name: string;
  location: string;
  coordinates: string[];
  subtitle: string;
  rangeLife: string;
  visited: boolean;
  bio: string;
  images: { label: string; pic: string }[];
  cover: string;
}

export interface User {
  id: number;
  firstAccess: boolean;
}

export class AppDB extends Dexie {
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
    await db.statues.bulkAdd([
      {
        name: writersData[0].name,
        location: writersData[0].location,
        coordinates: writersData[0].coordinates,
        subtitle: writersData[0].subtitle,
        rangeLife: writersData[0].rangeLife,
        visited: writersData[0].visited,
        bio: writersData[0].bio,
        images: writersData[0].images,
        cover: writersData[0].cover,
      },
      {
        name: writersData[1].name,
        location: writersData[1].location,
        coordinates: writersData[1].coordinates,
        subtitle: writersData[1].subtitle,
        rangeLife: writersData[1].rangeLife,
        visited: writersData[1].visited,
        bio: writersData[1].bio,
        images: writersData[1].images,
        cover: writersData[1].cover,
      },
    ]);

    await db.user.add({
      id: 1,
      firstAccess: true,
    });
  }
}

export const db = new AppDB();
