import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import TipoPessoaResolve from './route/tipo-pessoa-routing-resolve.service';

const tipoPessoaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/tipo-pessoa.component').then(m => m.TipoPessoaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/tipo-pessoa-detail.component').then(m => m.TipoPessoaDetailComponent),
    resolve: {
      tipoPessoa: TipoPessoaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/tipo-pessoa-update.component').then(m => m.TipoPessoaUpdateComponent),
    resolve: {
      tipoPessoa: TipoPessoaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/tipo-pessoa-update.component').then(m => m.TipoPessoaUpdateComponent),
    resolve: {
      tipoPessoa: TipoPessoaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default tipoPessoaRoute;
