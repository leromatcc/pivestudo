import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOperacao, NewOperacao } from '../operacao.model';

export type PartialUpdateOperacao = Partial<IOperacao> & Pick<IOperacao, 'id'>;

export type EntityResponseType = HttpResponse<IOperacao>;
export type EntityArrayResponseType = HttpResponse<IOperacao[]>;

@Injectable({ providedIn: 'root' })
export class OperacaoService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/operacaos');

  create(operacao: NewOperacao): Observable<EntityResponseType> {
    return this.http.post<IOperacao>(this.resourceUrl, operacao, { observe: 'response' });
  }

  update(operacao: IOperacao): Observable<EntityResponseType> {
    return this.http.put<IOperacao>(`${this.resourceUrl}/${this.getOperacaoIdentifier(operacao)}`, operacao, { observe: 'response' });
  }

  partialUpdate(operacao: PartialUpdateOperacao): Observable<EntityResponseType> {
    return this.http.patch<IOperacao>(`${this.resourceUrl}/${this.getOperacaoIdentifier(operacao)}`, operacao, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOperacao>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOperacao[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOperacaoIdentifier(operacao: Pick<IOperacao, 'id'>): number {
    return operacao.id;
  }

  compareOperacao(o1: Pick<IOperacao, 'id'> | null, o2: Pick<IOperacao, 'id'> | null): boolean {
    return o1 && o2 ? this.getOperacaoIdentifier(o1) === this.getOperacaoIdentifier(o2) : o1 === o2;
  }

  addOperacaoToCollectionIfMissing<Type extends Pick<IOperacao, 'id'>>(
    operacaoCollection: Type[],
    ...operacaosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const operacaos: Type[] = operacaosToCheck.filter(isPresent);
    if (operacaos.length > 0) {
      const operacaoCollectionIdentifiers = operacaoCollection.map(operacaoItem => this.getOperacaoIdentifier(operacaoItem));
      const operacaosToAdd = operacaos.filter(operacaoItem => {
        const operacaoIdentifier = this.getOperacaoIdentifier(operacaoItem);
        if (operacaoCollectionIdentifiers.includes(operacaoIdentifier)) {
          return false;
        }
        operacaoCollectionIdentifiers.push(operacaoIdentifier);
        return true;
      });
      return [...operacaosToAdd, ...operacaoCollection];
    }
    return operacaoCollection;
  }
}
