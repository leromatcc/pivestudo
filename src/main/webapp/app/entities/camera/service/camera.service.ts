import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICamera, NewCamera } from '../camera.model';

export type PartialUpdateCamera = Partial<ICamera> & Pick<ICamera, 'id'>;

export type EntityResponseType = HttpResponse<ICamera>;
export type EntityArrayResponseType = HttpResponse<ICamera[]>;

@Injectable({ providedIn: 'root' })
export class CameraService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cameras');

  create(camera: NewCamera): Observable<EntityResponseType> {
    return this.http.post<ICamera>(this.resourceUrl, camera, { observe: 'response' });
  }

  update(camera: ICamera): Observable<EntityResponseType> {
    return this.http.put<ICamera>(`${this.resourceUrl}/${this.getCameraIdentifier(camera)}`, camera, { observe: 'response' });
  }

  partialUpdate(camera: PartialUpdateCamera): Observable<EntityResponseType> {
    return this.http.patch<ICamera>(`${this.resourceUrl}/${this.getCameraIdentifier(camera)}`, camera, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICamera>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICamera[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCameraIdentifier(camera: Pick<ICamera, 'id'>): number {
    return camera.id;
  }

  compareCamera(o1: Pick<ICamera, 'id'> | null, o2: Pick<ICamera, 'id'> | null): boolean {
    return o1 && o2 ? this.getCameraIdentifier(o1) === this.getCameraIdentifier(o2) : o1 === o2;
  }

  addCameraToCollectionIfMissing<Type extends Pick<ICamera, 'id'>>(
    cameraCollection: Type[],
    ...camerasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const cameras: Type[] = camerasToCheck.filter(isPresent);
    if (cameras.length > 0) {
      const cameraCollectionIdentifiers = cameraCollection.map(cameraItem => this.getCameraIdentifier(cameraItem));
      const camerasToAdd = cameras.filter(cameraItem => {
        const cameraIdentifier = this.getCameraIdentifier(cameraItem);
        if (cameraCollectionIdentifiers.includes(cameraIdentifier)) {
          return false;
        }
        cameraCollectionIdentifiers.push(cameraIdentifier);
        return true;
      });
      return [...camerasToAdd, ...cameraCollection];
    }
    return cameraCollection;
  }
}
