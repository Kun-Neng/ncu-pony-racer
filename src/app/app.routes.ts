import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./component/home/home').then(m => m.Home)
  },
  {
    path: 'races',
    loadChildren: () => import('./component/ncu-races/ncu-races.routes').then(m => m.raceRoutes)
  },
];
