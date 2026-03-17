import { Component, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PonyModel } from '../../models/pony.model';
import { RaceService } from '../../service/race';
import { NcuPony } from '../ncu-pony/ncu-pony';

@Component({
  selector: 'app-ncu-race',
  imports: [NcuPony],
  templateUrl: './ncu-race.html',
  styleUrl: './ncu-race.css',
})
export class NcuRace {
  private readonly raceService = inject(RaceService);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly race = toSignal(
    this.activatedRoute.paramMap.pipe(
      switchMap(params => 
        this.raceService.getById(Number(params.get('raceId')))
      )
    ), { initialValue: null }
  );

  protected readonly ponies = signal<Array<PonyModel>>([]);
  protected readonly selectedPony = signal<PonyModel | null>(null);

  constructor() {
    effect(() => {
      const raceData = this.race();

      if (raceData?.ponies) {
        this.ponies.set([...raceData.ponies]);

        const savedPonyId = this.raceService.getSelectedPonyId(raceData.id);
        if (savedPonyId) {
          const savedPony = raceData.ponies.find(p => p.id === savedPonyId);
          if (savedPony) {
            this.selectedPony.set(savedPony);
          }
        }
      }
    });
  }

  protected handlePonyClicked(pony: PonyModel): void {
    this.selectedPony.set(pony);
    const raceId = this.race()?.id;
    if (raceId) {
      this.raceService.saveSelectedPony(raceId, pony.id);
    }
  }
}
