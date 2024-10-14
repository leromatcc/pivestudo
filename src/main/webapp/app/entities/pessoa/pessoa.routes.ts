import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import PessoaResolve from './route/pessoa-routing-resolve.service';

const pessoaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/pessoa.component').then(m => m.PessoaComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/pessoa-detail.component').then(m => m.PessoaDetailComponent),
    resolve: {
      pessoa: PessoaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/pessoa-update.component').then(m => m.PessoaUpdateComponent),
    resolve: {
      pessoa: PessoaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/pessoa-update.component').then(m => m.PessoaUpdateComponent),
    resolve: {
      pessoa: PessoaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default pessoaRoute;
