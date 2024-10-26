import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISobre } from '../sobre.model';
import { SobreService } from '../service/sobre.service';

const sobreResolve = (route: ActivatedRouteSnapshot): Observable<null | ISobre> => {
  const id = route.params.id;
  if (id) {
    return inject(SobreService)
      .find(id)
      .pipe(
        mergeMap((sobre: HttpResponse<ISobre>) => {
          if (sobre.body) {
            return of(sobre.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default sobreResolve;
