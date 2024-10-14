import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import DocumentoResolve from './route/documento-routing-resolve.service';

const documentoRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/documento.component').then(m => m.DocumentoComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/documento-detail.component').then(m => m.DocumentoDetailComponent),
    resolve: {
      documento: DocumentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/documento-update.component').then(m => m.DocumentoUpdateComponent),
    resolve: {
      documento: DocumentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/documento-update.component').then(m => m.DocumentoUpdateComponent),
    resolve: {
      documento: DocumentoResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default documentoRoute;
