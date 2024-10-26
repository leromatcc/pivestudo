import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import SobreResolve from './route/sobre-routing-resolve.service';

const sobreRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/sobre.component').then(m => m.SobreComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/sobre-detail.component').then(m => m.SobreDetailComponent),
    resolve: {
      sobre: SobreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/sobre-update.component').then(m => m.SobreUpdateComponent),
    resolve: {
      sobre: SobreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/sobre-update.component').then(m => m.SobreUpdateComponent),
    resolve: {
      sobre: SobreResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default sobreRoute;
