import { Poem } from './poem.interface';

export interface Statue {
  id: string;
  name: string;
  normalizedName: string;
  location: string;
  coordinates: string[];
  subtitle: string;
  rangeLife: string;
  visited: boolean;
  bio: string;
  poems: Poem[];
  imgsAmount: number;
}
