import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPontoAcesso, NewPontoAcesso } from '../ponto-acesso.model';

export type PartialUpdatePontoAcesso = Partial<IPontoAcesso> & Pick<IPontoAcesso, 'id'>;

export type EntityResponseType = HttpResponse<IPontoAcesso>;
export type EntityArrayResponseType = HttpResponse<IPontoAcesso[]>;

@Injectable({ providedIn: 'root' })
export class PontoAcessoService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ponto-acessos');

  create(pontoAcesso: NewPontoAcesso): Observable<EntityResponseType> {
    return this.http.post<IPontoAcesso>(this.resourceUrl, pontoAcesso, { observe: 'response' });
  }

  update(pontoAcesso: IPontoAcesso): Observable<EntityResponseType> {
    return this.http.put<IPontoAcesso>(`${this.resourceUrl}/${this.getPontoAcessoIdentifier(pontoAcesso)}`, pontoAcesso, {
      observe: 'response',
    });
  }

  partialUpdate(pontoAcesso: PartialUpdatePontoAcesso): Observable<EntityResponseType> {
    return this.http.patch<IPontoAcesso>(`${this.resourceUrl}/${this.getPontoAcessoIdentifier(pontoAcesso)}`, pontoAcesso, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IPontoAcesso>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPontoAcesso[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPontoAcessoIdentifier(pontoAcesso: Pick<IPontoAcesso, 'id'>): string {
    return pontoAcesso.id;
  }

  comparePontoAcesso(o1: Pick<IPontoAcesso, 'id'> | null, o2: Pick<IPontoAcesso, 'id'> | null): boolean {
    return o1 && o2 ? this.getPontoAcessoIdentifier(o1) === this.getPontoAcessoIdentifier(o2) : o1 === o2;
  }

  addPontoAcessoToCollectionIfMissing<Type extends Pick<IPontoAcesso, 'id'>>(
    pontoAcessoCollection: Type[],
    ...pontoAcessosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const pontoAcessos: Type[] = pontoAcessosToCheck.filter(isPresent);
    if (pontoAcessos.length > 0) {
      const pontoAcessoCollectionIdentifiers = pontoAcessoCollection.map(pontoAcessoItem => this.getPontoAcessoIdentifier(pontoAcessoItem));
      const pontoAcessosToAdd = pontoAcessos.filter(pontoAcessoItem => {
        const pontoAcessoIdentifier = this.getPontoAcessoIdentifier(pontoAcessoItem);
        if (pontoAcessoCollectionIdentifiers.includes(pontoAcessoIdentifier)) {
          return false;
        }
        pontoAcessoCollectionIdentifiers.push(pontoAcessoIdentifier);
        return true;
      });
      return [...pontoAcessosToAdd, ...pontoAcessoCollection];
    }
    return pontoAcessoCollection;
  }
}
