import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import TelefoneResolve from './route/telefone-routing-resolve.service';

const telefoneRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/telefone.component').then(m => m.TelefoneComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/telefone-detail.component').then(m => m.TelefoneDetailComponent),
    resolve: {
      telefone: TelefoneResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/telefone-update.component').then(m => m.TelefoneUpdateComponent),
    resolve: {
      telefone: TelefoneResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/telefone-update.component').then(m => m.TelefoneUpdateComponent),
    resolve: {
      telefone: TelefoneResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default telefoneRoute;
