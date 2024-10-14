import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPontoAcesso } from '../ponto-acesso.model';
import { PontoAcessoService } from '../service/ponto-acesso.service';

const pontoAcessoResolve = (route: ActivatedRouteSnapshot): Observable<null | IPontoAcesso> => {
  const id = route.params.id;
  if (id) {
    return inject(PontoAcessoService)
      .find(id)
      .pipe(
        mergeMap((pontoAcesso: HttpResponse<IPontoAcesso>) => {
          if (pontoAcesso.body) {
            return of(pontoAcesso.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default pontoAcessoResolve;
