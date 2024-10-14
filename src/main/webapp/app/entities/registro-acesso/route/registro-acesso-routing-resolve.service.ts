import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRegistroAcesso } from '../registro-acesso.model';
import { RegistroAcessoService } from '../service/registro-acesso.service';

const registroAcessoResolve = (route: ActivatedRouteSnapshot): Observable<null | IRegistroAcesso> => {
  const id = route.params.id;
  if (id) {
    return inject(RegistroAcessoService)
      .find(id)
      .pipe(
        mergeMap((registroAcesso: HttpResponse<IRegistroAcesso>) => {
          if (registroAcesso.body) {
            return of(registroAcesso.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default registroAcessoResolve;
