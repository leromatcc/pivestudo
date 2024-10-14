import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITelefone } from '../telefone.model';
import { TelefoneService } from '../service/telefone.service';

const telefoneResolve = (route: ActivatedRouteSnapshot): Observable<null | ITelefone> => {
  const id = route.params.id;
  if (id) {
    return inject(TelefoneService)
      .find(id)
      .pipe(
        mergeMap((telefone: HttpResponse<ITelefone>) => {
          if (telefone.body) {
            return of(telefone.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default telefoneResolve;
