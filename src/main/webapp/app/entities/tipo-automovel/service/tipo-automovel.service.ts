import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITipoAutomovel, NewTipoAutomovel } from '../tipo-automovel.model';

export type PartialUpdateTipoAutomovel = Partial<ITipoAutomovel> & Pick<ITipoAutomovel, 'id'>;

export type EntityResponseType = HttpResponse<ITipoAutomovel>;
export type EntityArrayResponseType = HttpResponse<ITipoAutomovel[]>;

@Injectable({ providedIn: 'root' })
export class TipoAutomovelService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tipo-automovels');

  create(tipoAutomovel: NewTipoAutomovel): Observable<EntityResponseType> {
    return this.http.post<ITipoAutomovel>(this.resourceUrl, tipoAutomovel, { observe: 'response' });
  }

  update(tipoAutomovel: ITipoAutomovel): Observable<EntityResponseType> {
    return this.http.put<ITipoAutomovel>(`${this.resourceUrl}/${this.getTipoAutomovelIdentifier(tipoAutomovel)}`, tipoAutomovel, {
      observe: 'response',
    });
  }

  partialUpdate(tipoAutomovel: PartialUpdateTipoAutomovel): Observable<EntityResponseType> {
    return this.http.patch<ITipoAutomovel>(`${this.resourceUrl}/${this.getTipoAutomovelIdentifier(tipoAutomovel)}`, tipoAutomovel, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ITipoAutomovel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITipoAutomovel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTipoAutomovelIdentifier(tipoAutomovel: Pick<ITipoAutomovel, 'id'>): string {
    return tipoAutomovel.id;
  }

  compareTipoAutomovel(o1: Pick<ITipoAutomovel, 'id'> | null, o2: Pick<ITipoAutomovel, 'id'> | null): boolean {
    return o1 && o2 ? this.getTipoAutomovelIdentifier(o1) === this.getTipoAutomovelIdentifier(o2) : o1 === o2;
  }

  addTipoAutomovelToCollectionIfMissing<Type extends Pick<ITipoAutomovel, 'id'>>(
    tipoAutomovelCollection: Type[],
    ...tipoAutomovelsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tipoAutomovels: Type[] = tipoAutomovelsToCheck.filter(isPresent);
    if (tipoAutomovels.length > 0) {
      const tipoAutomovelCollectionIdentifiers = tipoAutomovelCollection.map(tipoAutomovelItem =>
        this.getTipoAutomovelIdentifier(tipoAutomovelItem),
      );
      const tipoAutomovelsToAdd = tipoAutomovels.filter(tipoAutomovelItem => {
        const tipoAutomovelIdentifier = this.getTipoAutomovelIdentifier(tipoAutomovelItem);
        if (tipoAutomovelCollectionIdentifiers.includes(tipoAutomovelIdentifier)) {
          return false;
        }
        tipoAutomovelCollectionIdentifiers.push(tipoAutomovelIdentifier);
        return true;
      });
      return [...tipoAutomovelsToAdd, ...tipoAutomovelCollection];
    }
    return tipoAutomovelCollection;
  }
}
