import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISobre, NewSobre } from '../sobre.model';

export type PartialUpdateSobre = Partial<ISobre> & Pick<ISobre, 'id'>;

export type EntityResponseType = HttpResponse<ISobre>;
export type EntityArrayResponseType = HttpResponse<ISobre[]>;

@Injectable({ providedIn: 'root' })
export class SobreService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sobres');

  create(sobre: NewSobre): Observable<EntityResponseType> {
    return this.http.post<ISobre>(this.resourceUrl, sobre, { observe: 'response' });
  }

  update(sobre: ISobre): Observable<EntityResponseType> {
    return this.http.put<ISobre>(`${this.resourceUrl}/${this.getSobreIdentifier(sobre)}`, sobre, { observe: 'response' });
  }

  partialUpdate(sobre: PartialUpdateSobre): Observable<EntityResponseType> {
    return this.http.patch<ISobre>(`${this.resourceUrl}/${this.getSobreIdentifier(sobre)}`, sobre, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISobre>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISobre[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSobreIdentifier(sobre: Pick<ISobre, 'id'>): number {
    return sobre.id;
  }

  compareSobre(o1: Pick<ISobre, 'id'> | null, o2: Pick<ISobre, 'id'> | null): boolean {
    return o1 && o2 ? this.getSobreIdentifier(o1) === this.getSobreIdentifier(o2) : o1 === o2;
  }

  addSobreToCollectionIfMissing<Type extends Pick<ISobre, 'id'>>(
    sobreCollection: Type[],
    ...sobresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const sobres: Type[] = sobresToCheck.filter(isPresent);
    if (sobres.length > 0) {
      const sobreCollectionIdentifiers = sobreCollection.map(sobreItem => this.getSobreIdentifier(sobreItem));
      const sobresToAdd = sobres.filter(sobreItem => {
        const sobreIdentifier = this.getSobreIdentifier(sobreItem);
        if (sobreCollectionIdentifiers.includes(sobreIdentifier)) {
          return false;
        }
        sobreCollectionIdentifiers.push(sobreIdentifier);
        return true;
      });
      return [...sobresToAdd, ...sobreCollection];
    }
    return sobreCollection;
  }
}
