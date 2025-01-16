import Dexie, { Table } from 'dexie';
import writtersData from './writters.json';

export interface Statue {
  name: string;
  location: string;
  subtitle: string;
  rangeLife: string;
  visited: boolean;
  bio: string;
  images: { label: string; pic: string }[];
  cover: string;
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
        location: writtersData[0].location,
        subtitle: writtersData[0].subtitle,
        rangeLife: writtersData[0].rangeLife,
        visited: writtersData[0].visited,
        bio: writtersData[0].bio,
        images: writtersData[0].images,
        cover: writtersData[0].cover,
      },
      {
        name: writtersData[1].name,
        location: writtersData[1].location,
        subtitle: writtersData[1].subtitle,
        rangeLife: writtersData[1].rangeLife,
        visited: writtersData[1].visited,
        bio: writtersData[1].bio,
        images: writtersData[1].images,
        cover: writtersData[1].cover,
      },
    ]);
  }
}

export const db = new AppDB();
