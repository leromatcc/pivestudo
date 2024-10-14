import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEstabelecimento, NewEstabelecimento } from '../estabelecimento.model';

export type PartialUpdateEstabelecimento = Partial<IEstabelecimento> & Pick<IEstabelecimento, 'id'>;

export type EntityResponseType = HttpResponse<IEstabelecimento>;
export type EntityArrayResponseType = HttpResponse<IEstabelecimento[]>;

@Injectable({ providedIn: 'root' })
export class EstabelecimentoService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/estabelecimentos');

  create(estabelecimento: NewEstabelecimento): Observable<EntityResponseType> {
    return this.http.post<IEstabelecimento>(this.resourceUrl, estabelecimento, { observe: 'response' });
  }

  update(estabelecimento: IEstabelecimento): Observable<EntityResponseType> {
    return this.http.put<IEstabelecimento>(`${this.resourceUrl}/${this.getEstabelecimentoIdentifier(estabelecimento)}`, estabelecimento, {
      observe: 'response',
    });
  }

  partialUpdate(estabelecimento: PartialUpdateEstabelecimento): Observable<EntityResponseType> {
    return this.http.patch<IEstabelecimento>(`${this.resourceUrl}/${this.getEstabelecimentoIdentifier(estabelecimento)}`, estabelecimento, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IEstabelecimento>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEstabelecimento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEstabelecimentoIdentifier(estabelecimento: Pick<IEstabelecimento, 'id'>): string {
    return estabelecimento.id;
  }

  compareEstabelecimento(o1: Pick<IEstabelecimento, 'id'> | null, o2: Pick<IEstabelecimento, 'id'> | null): boolean {
    return o1 && o2 ? this.getEstabelecimentoIdentifier(o1) === this.getEstabelecimentoIdentifier(o2) : o1 === o2;
  }

  addEstabelecimentoToCollectionIfMissing<Type extends Pick<IEstabelecimento, 'id'>>(
    estabelecimentoCollection: Type[],
    ...estabelecimentosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const estabelecimentos: Type[] = estabelecimentosToCheck.filter(isPresent);
    if (estabelecimentos.length > 0) {
      const estabelecimentoCollectionIdentifiers = estabelecimentoCollection.map(estabelecimentoItem =>
        this.getEstabelecimentoIdentifier(estabelecimentoItem),
      );
      const estabelecimentosToAdd = estabelecimentos.filter(estabelecimentoItem => {
        const estabelecimentoIdentifier = this.getEstabelecimentoIdentifier(estabelecimentoItem);
        if (estabelecimentoCollectionIdentifiers.includes(estabelecimentoIdentifier)) {
          return false;
        }
        estabelecimentoCollectionIdentifiers.push(estabelecimentoIdentifier);
        return true;
      });
      return [...estabelecimentosToAdd, ...estabelecimentoCollection];
    }
    return estabelecimentoCollection;
  }
}
