import { Routes } from "@angular/router";

export const raceRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./ncu-races').then(m => m.NcuRaces),
  },
  {
    path: ':raceId',
    loadComponent: () => import('../ncu-race/ncu-race').then(m => m.NcuRace),
  },
];
