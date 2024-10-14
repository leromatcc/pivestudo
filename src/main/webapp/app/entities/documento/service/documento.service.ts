import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDocumento, NewDocumento } from '../documento.model';

export type PartialUpdateDocumento = Partial<IDocumento> & Pick<IDocumento, 'id'>;

export type EntityResponseType = HttpResponse<IDocumento>;
export type EntityArrayResponseType = HttpResponse<IDocumento[]>;

@Injectable({ providedIn: 'root' })
export class DocumentoService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/documentos');

  create(documento: NewDocumento): Observable<EntityResponseType> {
    return this.http.post<IDocumento>(this.resourceUrl, documento, { observe: 'response' });
  }

  update(documento: IDocumento): Observable<EntityResponseType> {
    return this.http.put<IDocumento>(`${this.resourceUrl}/${this.getDocumentoIdentifier(documento)}`, documento, { observe: 'response' });
  }

  partialUpdate(documento: PartialUpdateDocumento): Observable<EntityResponseType> {
    return this.http.patch<IDocumento>(`${this.resourceUrl}/${this.getDocumentoIdentifier(documento)}`, documento, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IDocumento>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDocumento[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDocumentoIdentifier(documento: Pick<IDocumento, 'id'>): string {
    return documento.id;
  }

  compareDocumento(o1: Pick<IDocumento, 'id'> | null, o2: Pick<IDocumento, 'id'> | null): boolean {
    return o1 && o2 ? this.getDocumentoIdentifier(o1) === this.getDocumentoIdentifier(o2) : o1 === o2;
  }

  addDocumentoToCollectionIfMissing<Type extends Pick<IDocumento, 'id'>>(
    documentoCollection: Type[],
    ...documentosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const documentos: Type[] = documentosToCheck.filter(isPresent);
    if (documentos.length > 0) {
      const documentoCollectionIdentifiers = documentoCollection.map(documentoItem => this.getDocumentoIdentifier(documentoItem));
      const documentosToAdd = documentos.filter(documentoItem => {
        const documentoIdentifier = this.getDocumentoIdentifier(documentoItem);
        if (documentoCollectionIdentifiers.includes(documentoIdentifier)) {
          return false;
        }
        documentoCollectionIdentifiers.push(documentoIdentifier);
        return true;
      });
      return [...documentosToAdd, ...documentoCollection];
    }
    return documentoCollection;
  }
}
