import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import EstabelecimentoResolve from './route/estabelecimento-routing-resolve.service';

const estabelecimentoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/estabelecimento.component').then(m => m.EstabelecimentoComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/estabelecimento-detail.component').then(m => m.EstabelecimentoDetailComponent),
    resolve: {
      estabelecimento: EstabelecimentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/estabelecimento-update.component').then(m => m.EstabelecimentoUpdateComponent),
    resolve: {
      estabelecimento: EstabelecimentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/estabelecimento-update.component').then(m => m.EstabelecimentoUpdateComponent),
    resolve: {
      estabelecimento: EstabelecimentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default estabelecimentoRoute;
