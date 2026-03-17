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
      regionImage: 'images/london.png',
      ponies: [
        { id: 1, color: 'green', name: 'Green Thunder' },
        { id: 2, color: 'orange', name: 'Orange Flash' },
        { id: 3, color: 'blue', name: 'Blue Storm' }
      ]
    },
    {
      id: 2,
      name: 'Lyon',
      regionImage: 'images/lyon.png',
      ponies: [
        { id: 4, color: 'purple', name: 'Purple Lightning' },
        { id: 5, color: 'yellow', name: 'Yellow Comet' }
      ]
    }
  ];

  private readonly STORAGE_KEY = 'selectedPonies';

  list(): Observable<Array<RaceModel>> {
    return of(this.races);
  }

  getById(id: number): Observable<RaceModel | undefined> {
    return of(this.races.find(race => race.id === id));
  }

  saveSelectedPony(raceId: number, ponyId: number): void {
    const selectedPonies = this.getSelectedPoniesFromStorage();
    selectedPonies[raceId] = ponyId;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(selectedPonies));
  }

  getSelectedPonyId(raceId: number): number | undefined {
    const selectedPonies = this.getSelectedPoniesFromStorage();
    return selectedPonies[raceId];
  }

  clearSelectedPony(raceId: number): void {
    const selectedPonies = this.getSelectedPoniesFromStorage();
    delete selectedPonies[raceId];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(selectedPonies));
  }

  private getSelectedPoniesFromStorage(): Record<number, number> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }
}
