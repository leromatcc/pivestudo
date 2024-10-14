import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import TipoAutomovelResolve from './route/tipo-automovel-routing-resolve.service';

const tipoAutomovelRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/tipo-automovel.component').then(m => m.TipoAutomovelComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/tipo-automovel-detail.component').then(m => m.TipoAutomovelDetailComponent),
    resolve: {
      tipoAutomovel: TipoAutomovelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/tipo-automovel-update.component').then(m => m.TipoAutomovelUpdateComponent),
    resolve: {
      tipoAutomovel: TipoAutomovelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/tipo-automovel-update.component').then(m => m.TipoAutomovelUpdateComponent),
    resolve: {
      tipoAutomovel: TipoAutomovelResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default tipoAutomovelRoute;
