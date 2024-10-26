import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import OperacaoResolve from './route/operacao-routing-resolve.service';

const operacaoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/operacao.component').then(m => m.OperacaoComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/operacao-detail.component').then(m => m.OperacaoDetailComponent),
    resolve: {
      operacao: OperacaoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/operacao-update.component').then(m => m.OperacaoUpdateComponent),
    resolve: {
      operacao: OperacaoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/operacao-update.component').then(m => m.OperacaoUpdateComponent),
    resolve: {
      operacao: OperacaoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default operacaoRoute;
