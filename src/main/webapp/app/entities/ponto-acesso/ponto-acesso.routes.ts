import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import PontoAcessoResolve from './route/ponto-acesso-routing-resolve.service';

const pontoAcessoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/ponto-acesso.component').then(m => m.PontoAcessoComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/ponto-acesso-detail.component').then(m => m.PontoAcessoDetailComponent),
    resolve: {
      pontoAcesso: PontoAcessoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/ponto-acesso-update.component').then(m => m.PontoAcessoUpdateComponent),
    resolve: {
      pontoAcesso: PontoAcessoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/ponto-acesso-update.component').then(m => m.PontoAcessoUpdateComponent),
    resolve: {
      pontoAcesso: PontoAcessoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pontoAcessoRoute;
