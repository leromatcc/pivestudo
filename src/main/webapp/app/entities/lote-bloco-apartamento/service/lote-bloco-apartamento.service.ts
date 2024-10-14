import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILoteBlocoApartamento, NewLoteBlocoApartamento } from '../lote-bloco-apartamento.model';

export type PartialUpdateLoteBlocoApartamento = Partial<ILoteBlocoApartamento> & Pick<ILoteBlocoApartamento, 'id'>;

export type EntityResponseType = HttpResponse<ILoteBlocoApartamento>;
export type EntityArrayResponseType = HttpResponse<ILoteBlocoApartamento[]>;

@Injectable({ providedIn: 'root' })
export class LoteBlocoApartamentoService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/lote-bloco-apartamentos');

  create(loteBlocoApartamento: NewLoteBlocoApartamento): Observable<EntityResponseType> {
    return this.http.post<ILoteBlocoApartamento>(this.resourceUrl, loteBlocoApartamento, { observe: 'response' });
  }

  update(loteBlocoApartamento: ILoteBlocoApartamento): Observable<EntityResponseType> {
    return this.http.put<ILoteBlocoApartamento>(
      `${this.resourceUrl}/${this.getLoteBlocoApartamentoIdentifier(loteBlocoApartamento)}`,
      loteBlocoApartamento,
      { observe: 'response' },
    );
  }

  partialUpdate(loteBlocoApartamento: PartialUpdateLoteBlocoApartamento): Observable<EntityResponseType> {
    return this.http.patch<ILoteBlocoApartamento>(
      `${this.resourceUrl}/${this.getLoteBlocoApartamentoIdentifier(loteBlocoApartamento)}`,
      loteBlocoApartamento,
      { observe: 'response' },
    );
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ILoteBlocoApartamento>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILoteBlocoApartamento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLoteBlocoApartamentoIdentifier(loteBlocoApartamento: Pick<ILoteBlocoApartamento, 'id'>): string {
    return loteBlocoApartamento.id;
  }

  compareLoteBlocoApartamento(o1: Pick<ILoteBlocoApartamento, 'id'> | null, o2: Pick<ILoteBlocoApartamento, 'id'> | null): boolean {
    return o1 && o2 ? this.getLoteBlocoApartamentoIdentifier(o1) === this.getLoteBlocoApartamentoIdentifier(o2) : o1 === o2;
  }

  addLoteBlocoApartamentoToCollectionIfMissing<Type extends Pick<ILoteBlocoApartamento, 'id'>>(
    loteBlocoApartamentoCollection: Type[],
    ...loteBlocoApartamentosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const loteBlocoApartamentos: Type[] = loteBlocoApartamentosToCheck.filter(isPresent);
    if (loteBlocoApartamentos.length > 0) {
      const loteBlocoApartamentoCollectionIdentifiers = loteBlocoApartamentoCollection.map(loteBlocoApartamentoItem =>
        this.getLoteBlocoApartamentoIdentifier(loteBlocoApartamentoItem),
      );
      const loteBlocoApartamentosToAdd = loteBlocoApartamentos.filter(loteBlocoApartamentoItem => {
        const loteBlocoApartamentoIdentifier = this.getLoteBlocoApartamentoIdentifier(loteBlocoApartamentoItem);
        if (loteBlocoApartamentoCollectionIdentifiers.includes(loteBlocoApartamentoIdentifier)) {
          return false;
        }
        loteBlocoApartamentoCollectionIdentifiers.push(loteBlocoApartamentoIdentifier);
        return true;
      });
      return [...loteBlocoApartamentosToAdd, ...loteBlocoApartamentoCollection];
    }
    return loteBlocoApartamentoCollection;
  }
}
