import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAutorizacaoAcesso, NewAutorizacaoAcesso } from '../autorizacao-acesso.model';

export type PartialUpdateAutorizacaoAcesso = Partial<IAutorizacaoAcesso> & Pick<IAutorizacaoAcesso, 'id'>;

type RestOf<T extends IAutorizacaoAcesso | NewAutorizacaoAcesso> = Omit<T, 'dataInicial' | 'dataFinal'> & {
  dataInicial?: string | null;
  dataFinal?: string | null;
};

export type RestAutorizacaoAcesso = RestOf<IAutorizacaoAcesso>;

export type NewRestAutorizacaoAcesso = RestOf<NewAutorizacaoAcesso>;

export type PartialUpdateRestAutorizacaoAcesso = RestOf<PartialUpdateAutorizacaoAcesso>;

export type EntityResponseType = HttpResponse<IAutorizacaoAcesso>;
export type EntityArrayResponseType = HttpResponse<IAutorizacaoAcesso[]>;

@Injectable({ providedIn: 'root' })
export class AutorizacaoAcessoService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/autorizacao-acessos');

  create(autorizacaoAcesso: NewAutorizacaoAcesso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(autorizacaoAcesso);
    return this.http
      .post<RestAutorizacaoAcesso>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(autorizacaoAcesso: IAutorizacaoAcesso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(autorizacaoAcesso);
    return this.http
      .put<RestAutorizacaoAcesso>(`${this.resourceUrl}/${this.getAutorizacaoAcessoIdentifier(autorizacaoAcesso)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(autorizacaoAcesso: PartialUpdateAutorizacaoAcesso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(autorizacaoAcesso);
    return this.http
      .patch<RestAutorizacaoAcesso>(`${this.resourceUrl}/${this.getAutorizacaoAcessoIdentifier(autorizacaoAcesso)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestAutorizacaoAcesso>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAutorizacaoAcesso[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAutorizacaoAcessoIdentifier(autorizacaoAcesso: Pick<IAutorizacaoAcesso, 'id'>): string {
    return autorizacaoAcesso.id;
  }

  compareAutorizacaoAcesso(o1: Pick<IAutorizacaoAcesso, 'id'> | null, o2: Pick<IAutorizacaoAcesso, 'id'> | null): boolean {
    return o1 && o2 ? this.getAutorizacaoAcessoIdentifier(o1) === this.getAutorizacaoAcessoIdentifier(o2) : o1 === o2;
  }

  addAutorizacaoAcessoToCollectionIfMissing<Type extends Pick<IAutorizacaoAcesso, 'id'>>(
    autorizacaoAcessoCollection: Type[],
    ...autorizacaoAcessosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const autorizacaoAcessos: Type[] = autorizacaoAcessosToCheck.filter(isPresent);
    if (autorizacaoAcessos.length > 0) {
      const autorizacaoAcessoCollectionIdentifiers = autorizacaoAcessoCollection.map(autorizacaoAcessoItem =>
        this.getAutorizacaoAcessoIdentifier(autorizacaoAcessoItem),
      );
      const autorizacaoAcessosToAdd = autorizacaoAcessos.filter(autorizacaoAcessoItem => {
        const autorizacaoAcessoIdentifier = this.getAutorizacaoAcessoIdentifier(autorizacaoAcessoItem);
        if (autorizacaoAcessoCollectionIdentifiers.includes(autorizacaoAcessoIdentifier)) {
          return false;
        }
        autorizacaoAcessoCollectionIdentifiers.push(autorizacaoAcessoIdentifier);
        return true;
      });
      return [...autorizacaoAcessosToAdd, ...autorizacaoAcessoCollection];
    }
    return autorizacaoAcessoCollection;
  }

  protected convertDateFromClient<T extends IAutorizacaoAcesso | NewAutorizacaoAcesso | PartialUpdateAutorizacaoAcesso>(
    autorizacaoAcesso: T,
  ): RestOf<T> {
    return {
      ...autorizacaoAcesso,
      dataInicial: autorizacaoAcesso.dataInicial?.toJSON() ?? null,
      dataFinal: autorizacaoAcesso.dataFinal?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restAutorizacaoAcesso: RestAutorizacaoAcesso): IAutorizacaoAcesso {
    return {
      ...restAutorizacaoAcesso,
      dataInicial: restAutorizacaoAcesso.dataInicial ? dayjs(restAutorizacaoAcesso.dataInicial) : undefined,
      dataFinal: restAutorizacaoAcesso.dataFinal ? dayjs(restAutorizacaoAcesso.dataFinal) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAutorizacaoAcesso>): HttpResponse<IAutorizacaoAcesso> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAutorizacaoAcesso[]>): HttpResponse<IAutorizacaoAcesso[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
