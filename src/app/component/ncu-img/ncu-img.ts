import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ncu-img',
  imports: [],
  templateUrl: './ncu-img.html',
  styleUrl: './ncu-img.css',
})
export class NcuImg {
  readonly src = input.required<string>();
}
