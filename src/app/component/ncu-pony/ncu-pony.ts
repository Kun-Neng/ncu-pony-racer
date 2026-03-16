import { Component, computed, input, output } from '@angular/core';
import { PonyModel } from '../../models/pony.model';
import { NcuImg } from '../ncu-img/ncu-img';

@Component({
  selector: 'app-ncu-pony',
  imports: [NcuImg],
  templateUrl: './ncu-pony.html',
  styleUrl: './ncu-pony.css',
})
export class NcuPony {
  readonly ponyModel = input.required<PonyModel>();
  readonly ponyClicked = output<PonyModel>();

  protected readonly ponyImageUrl = computed(() =>
    `images/pony-${this.ponyModel().color}-running.gif`
  );

  protected clicked(): void {
    this.ponyClicked.emit(this.ponyModel());
  }
}
