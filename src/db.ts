import Dexie, { Table } from 'dexie';
import writtersData from './writters.json';

export interface Statue {
  name: string;
  location: string;
  subtitle: string;
  rangeLife: string;
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
        bio: writtersData[0].bio,
        images: writtersData[0].images,
        cover: writtersData[0].cover,
      },
      {
        name: writtersData[1].name,
        location: writtersData[1].location,
        subtitle: writtersData[1].subtitle,
        rangeLife: writtersData[1].rangeLife,
        bio: writtersData[1].bio,
        images: writtersData[1].images,
        cover: writtersData[1].cover,
      },
      {
        name: writtersData[2].name,
        location: writtersData[2].location,
        subtitle: writtersData[2].subtitle,
        rangeLife: writtersData[2].rangeLife,
        bio: writtersData[2].bio,
        images: writtersData[2].images,
        cover: writtersData[2].cover,
      },
      {
        name: writtersData[3].name,
        location: writtersData[3].location,
        subtitle: writtersData[3].subtitle,
        rangeLife: writtersData[3].rangeLife,
        bio: writtersData[3].bio,
        images: writtersData[3].images,
        cover: writtersData[3].cover,
      },
      {
        name: writtersData[4].name,
        location: writtersData[4].location,
        subtitle: writtersData[4].subtitle,
        rangeLife: writtersData[4].rangeLife,
        bio: writtersData[4].bio,
        images: writtersData[4].images,
        cover: writtersData[4].cover,
      },
      {
        name: writtersData[5].name,
        location: writtersData[5].location,
        subtitle: writtersData[5].subtitle,
        rangeLife: writtersData[5].rangeLife,
        bio: writtersData[5].bio,
        images: writtersData[5].images,
        cover: writtersData[5].cover,
      },
    ]);
  }
}

export const db = new AppDB();
