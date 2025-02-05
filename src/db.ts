import Dexie, { Table } from 'dexie';
import writersData from './writers.json';

export interface Statue {
  id?: number;
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
      {
        name: writersData[2].name,
        location: writersData[2].location,
        coordinates: writersData[2].coordinates,
        subtitle: writersData[2].subtitle,
        rangeLife: writersData[2].rangeLife,
        visited: writersData[2].visited,
        bio: writersData[2].bio,
        images: writersData[2].images,
        cover: writersData[2].cover,
      },
      {
        name: writersData[3].name,
        location: writersData[3].location,
        coordinates: writersData[3].coordinates,
        subtitle: writersData[3].subtitle,
        rangeLife: writersData[3].rangeLife,
        visited: writersData[3].visited,
        bio: writersData[3].bio,
        images: writersData[3].images,
        cover: writersData[3].cover,
      },
      {
        name: writersData[4].name,
        location: writersData[4].location,
        coordinates: writersData[4].coordinates,
        subtitle: writersData[4].subtitle,
        rangeLife: writersData[4].rangeLife,
        visited: writersData[4].visited,
        bio: writersData[4].bio,
        images: writersData[4].images,
        cover: writersData[4].cover,
      },
      {
        name: writersData[5].name,
        location: writersData[5].location,
        coordinates: writersData[5].coordinates,
        subtitle: writersData[5].subtitle,
        rangeLife: writersData[5].rangeLife,
        visited: writersData[5].visited,
        bio: writersData[5].bio,
        images: writersData[5].images,
        cover: writersData[5].cover,
      },
      {
        name: writersData[6].name,
        location: writersData[6].location,
        coordinates: writersData[6].coordinates,
        subtitle: writersData[6].subtitle,
        rangeLife: writersData[6].rangeLife,
        visited: writersData[6].visited,
        bio: writersData[6].bio,
        images: writersData[6].images,
        cover: writersData[6].cover,
      },
      {
        name: writersData[7].name,
        location: writersData[7].location,
        coordinates: writersData[7].coordinates,
        subtitle: writersData[7].subtitle,
        rangeLife: writersData[7].rangeLife,
        visited: writersData[7].visited,
        bio: writersData[7].bio,
        images: writersData[7].images,
        cover: writersData[7].cover,
      },
      {
        name: writersData[8].name,
        location: writersData[8].location,
        coordinates: writersData[8].coordinates,
        subtitle: writersData[8].subtitle,
        rangeLife: writersData[8].rangeLife,
        visited: writersData[8].visited,
        bio: writersData[8].bio,
        images: writersData[8].images,
        cover: writersData[8].cover,
      },
      {
        name: writersData[9].name,
        location: writersData[9].location,
        coordinates: writersData[9].coordinates,
        subtitle: writersData[9].subtitle,
        rangeLife: writersData[9].rangeLife,
        visited: writersData[9].visited,
        bio: writersData[9].bio,
        images: writersData[9].images,
        cover: writersData[9].cover,
      },
      {
        name: writersData[10].name,
        location: writersData[10].location,
        coordinates: writersData[10].coordinates,
        subtitle: writersData[10].subtitle,
        rangeLife: writersData[10].rangeLife,
        visited: writersData[10].visited,
        bio: writersData[10].bio,
        images: writersData[10].images,
        cover: writersData[10].cover,
      },
      {
        name: writersData[11].name,
        location: writersData[11].location,
        coordinates: writersData[11].coordinates,
        subtitle: writersData[11].subtitle,
        rangeLife: writersData[11].rangeLife,
        visited: writersData[11].visited,
        bio: writersData[11].bio,
        images: writersData[11].images,
        cover: writersData[11].cover,
      },
      {
        name: writersData[12].name,
        location: writersData[12].location,
        coordinates: writersData[12].coordinates,
        subtitle: writersData[12].subtitle,
        rangeLife: writersData[12].rangeLife,
        visited: writersData[12].visited,
        bio: writersData[12].bio,
        images: writersData[12].images,
        cover: writersData[12].cover,
      },
      {
        name: writersData[13].name,
        location: writersData[13].location,
        coordinates: writersData[13].coordinates,
        subtitle: writersData[13].subtitle,
        rangeLife: writersData[13].rangeLife,
        visited: writersData[13].visited,
        bio: writersData[13].bio,
        images: writersData[13].images,
        cover: writersData[13].cover,
      },
      {
        name: writersData[14].name,
        location: writersData[14].location,
        coordinates: writersData[14].coordinates,
        subtitle: writersData[14].subtitle,
        rangeLife: writersData[14].rangeLife,
        visited: writersData[14].visited,
        bio: writersData[14].bio,
        images: writersData[14].images,
        cover: writersData[14].cover,
      },
      {
        name: writersData[15].name,
        location: writersData[15].location,
        coordinates: writersData[15].coordinates,
        subtitle: writersData[15].subtitle,
        rangeLife: writersData[15].rangeLife,
        visited: writersData[15].visited,
        bio: writersData[15].bio,
        images: writersData[15].images,
        cover: writersData[15].cover,
      },
      {
        name: writersData[16].name,
        location: writersData[16].location,
        coordinates: writersData[16].coordinates,
        subtitle: writersData[16].subtitle,
        rangeLife: writersData[16].rangeLife,
        visited: writersData[16].visited,
        bio: writersData[16].bio,
        images: writersData[16].images,
        cover: writersData[16].cover,
      },
      {
        name: writersData[17].name,
        location: writersData[17].location,
        coordinates: writersData[17].coordinates,
        subtitle: writersData[17].subtitle,
        rangeLife: writersData[17].rangeLife,
        visited: writersData[17].visited,
        bio: writersData[17].bio,
        images: writersData[17].images,
        cover: writersData[17].cover,
      },
      {
        name: writersData[18].name,
        location: writersData[18].location,
        coordinates: writersData[18].coordinates,
        subtitle: writersData[18].subtitle,
        rangeLife: writersData[18].rangeLife,
        visited: writersData[18].visited,
        bio: writersData[18].bio,
        images: writersData[18].images,
        cover: writersData[18].cover,
      },
      {
        name: writersData[19].name,
        location: writersData[19].location,
        coordinates: writersData[19].coordinates,
        subtitle: writersData[19].subtitle,
        rangeLife: writersData[19].rangeLife,
        visited: writersData[19].visited,
        bio: writersData[19].bio,
        images: writersData[19].images,
        cover: writersData[19].cover,
      },
      {
        name: writersData[20].name,
        location: writersData[20].location,
        coordinates: writersData[20].coordinates,
        subtitle: writersData[20].subtitle,
        rangeLife: writersData[20].rangeLife,
        visited: writersData[20].visited,
        bio: writersData[20].bio,
        images: writersData[20].images,
        cover: writersData[20].cover,
      },
      {
        name: writersData[21].name,
        location: writersData[21].location,
        coordinates: writersData[21].coordinates,
        subtitle: writersData[21].subtitle,
        rangeLife: writersData[21].rangeLife,
        visited: writersData[21].visited,
        bio: writersData[21].bio,
        images: writersData[21].images,
        cover: writersData[21].cover,
      },
    ]);

    await db.user.add({
      id: 1,
      firstAccess: true,
    });
  }
}

export const db = new AppDB();
