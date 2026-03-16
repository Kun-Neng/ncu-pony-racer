import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { RaceService } from '../../service/race';

@Component({
  selector: 'app-ncu-races',
  imports: [RouterLink],
  templateUrl: './ncu-races.html',
  styleUrl: './ncu-races.css',
})
export class NcuRaces {
  private readonly raceService = inject(RaceService);

  protected readonly races = toSignal(
    this.raceService.list(), { initialValue: [] }
  );
}
