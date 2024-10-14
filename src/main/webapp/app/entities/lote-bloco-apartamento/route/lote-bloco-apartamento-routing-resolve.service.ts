import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILoteBlocoApartamento } from '../lote-bloco-apartamento.model';
import { LoteBlocoApartamentoService } from '../service/lote-bloco-apartamento.service';

const loteBlocoApartamentoResolve = (route: ActivatedRouteSnapshot): Observable<null | ILoteBlocoApartamento> => {
  const id = route.params.id;
  if (id) {
    return inject(LoteBlocoApartamentoService)
      .find(id)
      .pipe(
        mergeMap((loteBlocoApartamento: HttpResponse<ILoteBlocoApartamento>) => {
          if (loteBlocoApartamento.body) {
            return of(loteBlocoApartamento.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default loteBlocoApartamentoResolve;
