import { PonyModel } from './pony.model';

export interface RaceModel {
  id: number;
  name: string;
  regionImage?: string;
  ponies?: Array<PonyModel>;
}
