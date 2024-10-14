import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITipoPessoa } from '../tipo-pessoa.model';
import { TipoPessoaService } from '../service/tipo-pessoa.service';

const tipoPessoaResolve = (route: ActivatedRouteSnapshot): Observable<null | ITipoPessoa> => {
  const id = route.params.id;
  if (id) {
    return inject(TipoPessoaService)
      .find(id)
      .pipe(
        mergeMap((tipoPessoa: HttpResponse<ITipoPessoa>) => {
          if (tipoPessoa.body) {
            return of(tipoPessoa.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default tipoPessoaResolve;
