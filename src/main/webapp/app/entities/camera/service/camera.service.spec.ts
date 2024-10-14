import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ICamera } from '../camera.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../camera.test-samples';

import { CameraService } from './camera.service';

const requireRestSample: ICamera = {
  ...sampleWithRequiredData,
};

describe('Camera Service', () => {
  let service: CameraService;
  let httpMock: HttpTestingController;
  let expectedResult: ICamera | ICamera[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(CameraService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Camera', () => {
      const camera = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(camera).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Camera', () => {
      const camera = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(camera).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Camera', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Camera', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Camera', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCameraToCollectionIfMissing', () => {
      it('should add a Camera to an empty array', () => {
        const camera: ICamera = sampleWithRequiredData;
        expectedResult = service.addCameraToCollectionIfMissing([], camera);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(camera);
      });

      it('should not add a Camera to an array that contains it', () => {
        const camera: ICamera = sampleWithRequiredData;
        const cameraCollection: ICamera[] = [
          {
            ...camera,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCameraToCollectionIfMissing(cameraCollection, camera);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Camera to an array that doesn't contain it", () => {
        const camera: ICamera = sampleWithRequiredData;
        const cameraCollection: ICamera[] = [sampleWithPartialData];
        expectedResult = service.addCameraToCollectionIfMissing(cameraCollection, camera);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(camera);
      });

      it('should add only unique Camera to an array', () => {
        const cameraArray: ICamera[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const cameraCollection: ICamera[] = [sampleWithRequiredData];
        expectedResult = service.addCameraToCollectionIfMissing(cameraCollection, ...cameraArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const camera: ICamera = sampleWithRequiredData;
        const camera2: ICamera = sampleWithPartialData;
        expectedResult = service.addCameraToCollectionIfMissing([], camera, camera2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(camera);
        expect(expectedResult).toContain(camera2);
      });

      it('should accept null and undefined values', () => {
        const camera: ICamera = sampleWithRequiredData;
        expectedResult = service.addCameraToCollectionIfMissing([], null, camera, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(camera);
      });

      it('should return initial array if no Camera is added', () => {
        const cameraCollection: ICamera[] = [sampleWithRequiredData];
        expectedResult = service.addCameraToCollectionIfMissing(cameraCollection, undefined, null);
        expect(expectedResult).toEqual(cameraCollection);
      });
    });

    describe('compareCamera', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCamera(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCamera(entity1, entity2);
        const compareResult2 = service.compareCamera(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCamera(entity1, entity2);
        const compareResult2 = service.compareCamera(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCamera(entity1, entity2);
        const compareResult2 = service.compareCamera(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
