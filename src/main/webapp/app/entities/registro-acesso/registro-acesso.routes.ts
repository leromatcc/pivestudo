import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import RegistroAcessoResolve from './route/registro-acesso-routing-resolve.service';

const registroAcessoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/registro-acesso.component').then(m => m.RegistroAcessoComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/registro-acesso-detail.component').then(m => m.RegistroAcessoDetailComponent),
    resolve: {
      registroAcesso: RegistroAcessoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/registro-acesso-update.component').then(m => m.RegistroAcessoUpdateComponent),
    resolve: {
      registroAcesso: RegistroAcessoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/registro-acesso-update.component').then(m => m.RegistroAcessoUpdateComponent),
    resolve: {
      registroAcesso: RegistroAcessoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default registroAcessoRoute;
