import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import LoteBlocoApartamentoResolve from './route/lote-bloco-apartamento-routing-resolve.service';

const loteBlocoApartamentoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/lote-bloco-apartamento.component').then(m => m.LoteBlocoApartamentoComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/lote-bloco-apartamento-detail.component').then(m => m.LoteBlocoApartamentoDetailComponent),
    resolve: {
      loteBlocoApartamento: LoteBlocoApartamentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/lote-bloco-apartamento-update.component').then(m => m.LoteBlocoApartamentoUpdateComponent),
    resolve: {
      loteBlocoApartamento: LoteBlocoApartamentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/lote-bloco-apartamento-update.component').then(m => m.LoteBlocoApartamentoUpdateComponent),
    resolve: {
      loteBlocoApartamento: LoteBlocoApartamentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default loteBlocoApartamentoRoute;
