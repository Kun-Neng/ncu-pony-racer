import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RaceModel } from '../models/race.model';

@Injectable({
  providedIn: 'root',
})
export class RaceService {
  private races: RaceModel[] = [
    {
      id: 1,
      name: 'London',
      ponies: [
        { id: 1, color: 'green', name: 'Green Thunder' },
        { id: 2, color: 'orange', name: 'Orange Flash' },
        { id: 3, color: 'blue', name: 'Blue Storm' }
      ]
    },
    {
      id: 2,
      name: 'Lyon',
      ponies: [
        { id: 4, color: 'purple', name: 'Purple Lightning' },
        { id: 5, color: 'yellow', name: 'Yellow Comet' }
      ]
    }
  ];

  list(): Observable<Array<RaceModel>> {
    return of(this.races);
  }

  getById(id: number): Observable<RaceModel | undefined> {
    return of(this.races.find(race => race.id === id));
  }
}
