import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITipoAutomovel } from '../tipo-automovel.model';
import { TipoAutomovelService } from '../service/tipo-automovel.service';

const tipoAutomovelResolve = (route: ActivatedRouteSnapshot): Observable<null | ITipoAutomovel> => {
  const id = route.params.id;
  if (id) {
    return inject(TipoAutomovelService)
      .find(id)
      .pipe(
        mergeMap((tipoAutomovel: HttpResponse<ITipoAutomovel>) => {
          if (tipoAutomovel.body) {
            return of(tipoAutomovel.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default tipoAutomovelResolve;
