import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IImagem, NewImagem } from '../imagem.model';

export type PartialUpdateImagem = Partial<IImagem> & Pick<IImagem, 'id'>;

type RestOf<T extends IImagem | NewImagem> = Omit<T, 'dateAnalise'> & {
  dateAnalise?: string | null;
};

export type RestImagem = RestOf<IImagem>;

export type NewRestImagem = RestOf<NewImagem>;

export type PartialUpdateRestImagem = RestOf<PartialUpdateImagem>;

export type EntityResponseType = HttpResponse<IImagem>;
export type EntityArrayResponseType = HttpResponse<IImagem[]>;

@Injectable({ providedIn: 'root' })
export class ImagemService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/imagems');

  create(imagem: NewImagem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(imagem);
    return this.http
      .post<RestImagem>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(imagem: IImagem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(imagem);
    return this.http
      .put<RestImagem>(`${this.resourceUrl}/${this.getImagemIdentifier(imagem)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(imagem: PartialUpdateImagem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(imagem);
    return this.http
      .patch<RestImagem>(`${this.resourceUrl}/${this.getImagemIdentifier(imagem)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<RestImagem>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestImagem[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getImagemIdentifier(imagem: Pick<IImagem, 'id'>): string {
    return imagem.id;
  }

  compareImagem(o1: Pick<IImagem, 'id'> | null, o2: Pick<IImagem, 'id'> | null): boolean {
    return o1 && o2 ? this.getImagemIdentifier(o1) === this.getImagemIdentifier(o2) : o1 === o2;
  }

  addImagemToCollectionIfMissing<Type extends Pick<IImagem, 'id'>>(
    imagemCollection: Type[],
    ...imagemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const imagems: Type[] = imagemsToCheck.filter(isPresent);
    if (imagems.length > 0) {
      const imagemCollectionIdentifiers = imagemCollection.map(imagemItem => this.getImagemIdentifier(imagemItem));
      const imagemsToAdd = imagems.filter(imagemItem => {
        const imagemIdentifier = this.getImagemIdentifier(imagemItem);
        if (imagemCollectionIdentifiers.includes(imagemIdentifier)) {
          return false;
        }
        imagemCollectionIdentifiers.push(imagemIdentifier);
        return true;
      });
      return [...imagemsToAdd, ...imagemCollection];
    }
    return imagemCollection;
  }

  protected convertDateFromClient<T extends IImagem | NewImagem | PartialUpdateImagem>(imagem: T): RestOf<T> {
    return {
      ...imagem,
      dateAnalise: imagem.dateAnalise?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restImagem: RestImagem): IImagem {
    return {
      ...restImagem,
      dateAnalise: restImagem.dateAnalise ? dayjs(restImagem.dateAnalise) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestImagem>): HttpResponse<IImagem> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestImagem[]>): HttpResponse<IImagem[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
