import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAutomovel } from '../automovel.model';
import { AutomovelService } from '../service/automovel.service';

const automovelResolve = (route: ActivatedRouteSnapshot): Observable<null | IAutomovel> => {
  const id = route.params.id;
  if (id) {
    return inject(AutomovelService)
      .find(id)
      .pipe(
        mergeMap((automovel: HttpResponse<IAutomovel>) => {
          if (automovel.body) {
            return of(automovel.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default automovelResolve;
