import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAutorizacaoAcesso } from '../autorizacao-acesso.model';
import { AutorizacaoAcessoService } from '../service/autorizacao-acesso.service';

const autorizacaoAcessoResolve = (route: ActivatedRouteSnapshot): Observable<null | IAutorizacaoAcesso> => {
  const id = route.params.id;
  if (id) {
    return inject(AutorizacaoAcessoService)
      .find(id)
      .pipe(
        mergeMap((autorizacaoAcesso: HttpResponse<IAutorizacaoAcesso>) => {
          if (autorizacaoAcesso.body) {
            return of(autorizacaoAcesso.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default autorizacaoAcessoResolve;
