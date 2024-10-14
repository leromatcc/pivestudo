import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import AutomovelResolve from './route/automovel-routing-resolve.service';

const automovelRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/automovel.component').then(m => m.AutomovelComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/automovel-detail.component').then(m => m.AutomovelDetailComponent),
    resolve: {
      automovel: AutomovelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/automovel-update.component').then(m => m.AutomovelUpdateComponent),
    resolve: {
      automovel: AutomovelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/automovel-update.component').then(m => m.AutomovelUpdateComponent),
    resolve: {
      automovel: AutomovelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default automovelRoute;
