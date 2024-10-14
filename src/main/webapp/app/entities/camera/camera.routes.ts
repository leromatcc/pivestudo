import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import CameraResolve from './route/camera-routing-resolve.service';

const cameraRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/camera.component').then(m => m.CameraComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/camera-detail.component').then(m => m.CameraDetailComponent),
    resolve: {
      camera: CameraResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/camera-update.component').then(m => m.CameraUpdateComponent),
    resolve: {
      camera: CameraResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/camera-update.component').then(m => m.CameraUpdateComponent),
    resolve: {
      camera: CameraResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default cameraRoute;
