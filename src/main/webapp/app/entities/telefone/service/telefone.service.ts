import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITelefone, NewTelefone } from '../telefone.model';

export type PartialUpdateTelefone = Partial<ITelefone> & Pick<ITelefone, 'id'>;

export type EntityResponseType = HttpResponse<ITelefone>;
export type EntityArrayResponseType = HttpResponse<ITelefone[]>;

@Injectable({ providedIn: 'root' })
export class TelefoneService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/telefones');

  create(telefone: NewTelefone): Observable<EntityResponseType> {
    return this.http.post<ITelefone>(this.resourceUrl, telefone, { observe: 'response' });
  }

  update(telefone: ITelefone): Observable<EntityResponseType> {
    return this.http.put<ITelefone>(`${this.resourceUrl}/${this.getTelefoneIdentifier(telefone)}`, telefone, { observe: 'response' });
  }

  partialUpdate(telefone: PartialUpdateTelefone): Observable<EntityResponseType> {
    return this.http.patch<ITelefone>(`${this.resourceUrl}/${this.getTelefoneIdentifier(telefone)}`, telefone, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ITelefone>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITelefone[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTelefoneIdentifier(telefone: Pick<ITelefone, 'id'>): string {
    return telefone.id;
  }

  compareTelefone(o1: Pick<ITelefone, 'id'> | null, o2: Pick<ITelefone, 'id'> | null): boolean {
    return o1 && o2 ? this.getTelefoneIdentifier(o1) === this.getTelefoneIdentifier(o2) : o1 === o2;
  }

  addTelefoneToCollectionIfMissing<Type extends Pick<ITelefone, 'id'>>(
    telefoneCollection: Type[],
    ...telefonesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const telefones: Type[] = telefonesToCheck.filter(isPresent);
    if (telefones.length > 0) {
      const telefoneCollectionIdentifiers = telefoneCollection.map(telefoneItem => this.getTelefoneIdentifier(telefoneItem));
      const telefonesToAdd = telefones.filter(telefoneItem => {
        const telefoneIdentifier = this.getTelefoneIdentifier(telefoneItem);
        if (telefoneCollectionIdentifiers.includes(telefoneIdentifier)) {
          return false;
        }
        telefoneCollectionIdentifiers.push(telefoneIdentifier);
        return true;
      });
      return [...telefonesToAdd, ...telefoneCollection];
    }
    return telefoneCollection;
  }
}
