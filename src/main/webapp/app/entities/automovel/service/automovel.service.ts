import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAutomovel, NewAutomovel } from '../automovel.model';

export type PartialUpdateAutomovel = Partial<IAutomovel> & Pick<IAutomovel, 'id'>;

export type EntityResponseType = HttpResponse<IAutomovel>;
export type EntityArrayResponseType = HttpResponse<IAutomovel[]>;

@Injectable({ providedIn: 'root' })
export class AutomovelService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/automovels');

  create(automovel: NewAutomovel): Observable<EntityResponseType> {
    return this.http.post<IAutomovel>(this.resourceUrl, automovel, { observe: 'response' });
  }

  update(automovel: IAutomovel): Observable<EntityResponseType> {
    return this.http.put<IAutomovel>(`${this.resourceUrl}/${this.getAutomovelIdentifier(automovel)}`, automovel, { observe: 'response' });
  }

  partialUpdate(automovel: PartialUpdateAutomovel): Observable<EntityResponseType> {
    return this.http.patch<IAutomovel>(`${this.resourceUrl}/${this.getAutomovelIdentifier(automovel)}`, automovel, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IAutomovel>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAutomovel[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAutomovelIdentifier(automovel: Pick<IAutomovel, 'id'>): string {
    return automovel.id;
  }

  compareAutomovel(o1: Pick<IAutomovel, 'id'> | null, o2: Pick<IAutomovel, 'id'> | null): boolean {
    return o1 && o2 ? this.getAutomovelIdentifier(o1) === this.getAutomovelIdentifier(o2) : o1 === o2;
  }

  addAutomovelToCollectionIfMissing<Type extends Pick<IAutomovel, 'id'>>(
    automovelCollection: Type[],
    ...automovelsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const automovels: Type[] = automovelsToCheck.filter(isPresent);
    if (automovels.length > 0) {
      const automovelCollectionIdentifiers = automovelCollection.map(automovelItem => this.getAutomovelIdentifier(automovelItem));
      const automovelsToAdd = automovels.filter(automovelItem => {
        const automovelIdentifier = this.getAutomovelIdentifier(automovelItem);
        if (automovelCollectionIdentifiers.includes(automovelIdentifier)) {
          return false;
        }
        automovelCollectionIdentifiers.push(automovelIdentifier);
        return true;
      });
      return [...automovelsToAdd, ...automovelCollection];
    }
    return automovelCollection;
  }
}
