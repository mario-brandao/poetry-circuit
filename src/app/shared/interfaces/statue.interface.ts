import { Poem } from './poem.interface';

export interface Statue {
  id: string;
  name: string;
  normalizedName: string;
  location: string;
  coordinates: string[];
  subtitle: string;
  rangeLife: string;
  bio: string;
  poems: Poem[];
  imgsAmount: number;
  visited?: boolean;
  poemsVisited?: boolean[];
}
