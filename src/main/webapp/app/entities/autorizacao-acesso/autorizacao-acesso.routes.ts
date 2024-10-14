import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import AutorizacaoAcessoResolve from './route/autorizacao-acesso-routing-resolve.service';

const autorizacaoAcessoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/autorizacao-acesso.component').then(m => m.AutorizacaoAcessoComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/autorizacao-acesso-detail.component').then(m => m.AutorizacaoAcessoDetailComponent),
    resolve: {
      autorizacaoAcesso: AutorizacaoAcessoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/autorizacao-acesso-update.component').then(m => m.AutorizacaoAcessoUpdateComponent),
    resolve: {
      autorizacaoAcesso: AutorizacaoAcessoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/autorizacao-acesso-update.component').then(m => m.AutorizacaoAcessoUpdateComponent),
    resolve: {
      autorizacaoAcesso: AutorizacaoAcessoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default autorizacaoAcessoRoute;
