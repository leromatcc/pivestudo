import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRegistroAcesso, NewRegistroAcesso } from '../registro-acesso.model';

export type PartialUpdateRegistroAcesso = Partial<IRegistroAcesso> & Pick<IRegistroAcesso, 'id'>;

type RestOf<T extends IRegistroAcesso | NewRegistroAcesso> = Omit<T, 'dataHora'> & {
  dataHora?: string | null;
};

export type RestRegistroAcesso = RestOf<IRegistroAcesso>;

export type NewRestRegistroAcesso = RestOf<NewRegistroAcesso>;

export type PartialUpdateRestRegistroAcesso = RestOf<PartialUpdateRegistroAcesso>;

export type EntityResponseType = HttpResponse<IRegistroAcesso>;
export type EntityArrayResponseType = HttpResponse<IRegistroAcesso[]>;

@Injectable({ providedIn: 'root' })
export class RegistroAcessoService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/registro-acessos');

  create(registroAcesso: NewRegistroAcesso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registroAcesso);
    return this.http
      .post<RestRegistroAcesso>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(registroAcesso: IRegistroAcesso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registroAcesso);
    return this.http
      .put<RestRegistroAcesso>(`${this.resourceUrl}/${this.getRegistroAcessoIdentifier(registroAcesso)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(registroAcesso: PartialUpdateRegistroAcesso): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registroAcesso);
    return this.http
      .patch<RestRegistroAcesso>(`${this.resourceUrl}/${this.getRegistroAcessoIdentifier(registroAcesso)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestRegistroAcesso>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestRegistroAcesso[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getRegistroAcessoIdentifier(registroAcesso: Pick<IRegistroAcesso, 'id'>): string {
    return registroAcesso.id;
  }

  compareRegistroAcesso(o1: Pick<IRegistroAcesso, 'id'> | null, o2: Pick<IRegistroAcesso, 'id'> | null): boolean {
    return o1 && o2 ? this.getRegistroAcessoIdentifier(o1) === this.getRegistroAcessoIdentifier(o2) : o1 === o2;
  }

  addRegistroAcessoToCollectionIfMissing<Type extends Pick<IRegistroAcesso, 'id'>>(
    registroAcessoCollection: Type[],
    ...registroAcessosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const registroAcessos: Type[] = registroAcessosToCheck.filter(isPresent);
    if (registroAcessos.length > 0) {
      const registroAcessoCollectionIdentifiers = registroAcessoCollection.map(registroAcessoItem =>
        this.getRegistroAcessoIdentifier(registroAcessoItem),
      );
      const registroAcessosToAdd = registroAcessos.filter(registroAcessoItem => {
        const registroAcessoIdentifier = this.getRegistroAcessoIdentifier(registroAcessoItem);
        if (registroAcessoCollectionIdentifiers.includes(registroAcessoIdentifier)) {
          return false;
        }
        registroAcessoCollectionIdentifiers.push(registroAcessoIdentifier);
        return true;
      });
      return [...registroAcessosToAdd, ...registroAcessoCollection];
    }
    return registroAcessoCollection;
  }

  protected convertDateFromClient<T extends IRegistroAcesso | NewRegistroAcesso | PartialUpdateRegistroAcesso>(
    registroAcesso: T,
  ): RestOf<T> {
    return {
      ...registroAcesso,
      dataHora: registroAcesso.dataHora?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restRegistroAcesso: RestRegistroAcesso): IRegistroAcesso {
    return {
      ...restRegistroAcesso,
      dataHora: restRegistroAcesso.dataHora ? dayjs(restRegistroAcesso.dataHora) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestRegistroAcesso>): HttpResponse<IRegistroAcesso> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestRegistroAcesso[]>): HttpResponse<IRegistroAcesso[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
