import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITipoPessoa, NewTipoPessoa } from '../tipo-pessoa.model';

export type PartialUpdateTipoPessoa = Partial<ITipoPessoa> & Pick<ITipoPessoa, 'id'>;

export type EntityResponseType = HttpResponse<ITipoPessoa>;
export type EntityArrayResponseType = HttpResponse<ITipoPessoa[]>;

@Injectable({ providedIn: 'root' })
export class TipoPessoaService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tipo-pessoas');

  create(tipoPessoa: NewTipoPessoa): Observable<EntityResponseType> {
    return this.http.post<ITipoPessoa>(this.resourceUrl, tipoPessoa, { observe: 'response' });
  }

  update(tipoPessoa: ITipoPessoa): Observable<EntityResponseType> {
    return this.http.put<ITipoPessoa>(`${this.resourceUrl}/${this.getTipoPessoaIdentifier(tipoPessoa)}`, tipoPessoa, {
      observe: 'response',
    });
  }

  partialUpdate(tipoPessoa: PartialUpdateTipoPessoa): Observable<EntityResponseType> {
    return this.http.patch<ITipoPessoa>(`${this.resourceUrl}/${this.getTipoPessoaIdentifier(tipoPessoa)}`, tipoPessoa, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITipoPessoa>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITipoPessoa[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTipoPessoaIdentifier(tipoPessoa: Pick<ITipoPessoa, 'id'>): number {
    return tipoPessoa.id;
  }

  compareTipoPessoa(o1: Pick<ITipoPessoa, 'id'> | null, o2: Pick<ITipoPessoa, 'id'> | null): boolean {
    return o1 && o2 ? this.getTipoPessoaIdentifier(o1) === this.getTipoPessoaIdentifier(o2) : o1 === o2;
  }

  addTipoPessoaToCollectionIfMissing<Type extends Pick<ITipoPessoa, 'id'>>(
    tipoPessoaCollection: Type[],
    ...tipoPessoasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tipoPessoas: Type[] = tipoPessoasToCheck.filter(isPresent);
    if (tipoPessoas.length > 0) {
      const tipoPessoaCollectionIdentifiers = tipoPessoaCollection.map(tipoPessoaItem => this.getTipoPessoaIdentifier(tipoPessoaItem));
      const tipoPessoasToAdd = tipoPessoas.filter(tipoPessoaItem => {
        const tipoPessoaIdentifier = this.getTipoPessoaIdentifier(tipoPessoaItem);
        if (tipoPessoaCollectionIdentifiers.includes(tipoPessoaIdentifier)) {
          return false;
        }
        tipoPessoaCollectionIdentifiers.push(tipoPessoaIdentifier);
        return true;
      });
      return [...tipoPessoasToAdd, ...tipoPessoaCollection];
    }
    return tipoPessoaCollection;
  }
}
