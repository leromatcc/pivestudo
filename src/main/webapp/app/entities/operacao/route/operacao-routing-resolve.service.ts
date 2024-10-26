import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOperacao } from '../operacao.model';
import { OperacaoService } from '../service/operacao.service';

const operacaoResolve = (route: ActivatedRouteSnapshot): Observable<null | IOperacao> => {
  const id = route.params.id;
  if (id) {
    return inject(OperacaoService)
      .find(id)
      .pipe(
        mergeMap((operacao: HttpResponse<IOperacao>) => {
          if (operacao.body) {
            return of(operacao.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default operacaoResolve;
