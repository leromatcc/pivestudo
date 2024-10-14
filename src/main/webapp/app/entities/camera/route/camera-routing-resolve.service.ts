import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICamera } from '../camera.model';
import { CameraService } from '../service/camera.service';

const cameraResolve = (route: ActivatedRouteSnapshot): Observable<null | ICamera> => {
  const id = route.params.id;
  if (id) {
    return inject(CameraService)
      .find(id)
      .pipe(
        mergeMap((camera: HttpResponse<ICamera>) => {
          if (camera.body) {
            return of(camera.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default cameraResolve;
