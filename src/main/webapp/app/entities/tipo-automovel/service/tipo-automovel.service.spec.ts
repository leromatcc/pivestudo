import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITipoAutomovel } from '../tipo-automovel.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../tipo-automovel.test-samples';

import { TipoAutomovelService } from './tipo-automovel.service';

const requireRestSample: ITipoAutomovel = {
  ...sampleWithRequiredData,
};

describe('TipoAutomovel Service', () => {
  let service: TipoAutomovelService;
  let httpMock: HttpTestingController;
  let expectedResult: ITipoAutomovel | ITipoAutomovel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TipoAutomovelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a TipoAutomovel', () => {
      const tipoAutomovel = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(tipoAutomovel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TipoAutomovel', () => {
      const tipoAutomovel = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(tipoAutomovel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TipoAutomovel', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TipoAutomovel', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TipoAutomovel', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTipoAutomovelToCollectionIfMissing', () => {
      it('should add a TipoAutomovel to an empty array', () => {
        const tipoAutomovel: ITipoAutomovel = sampleWithRequiredData;
        expectedResult = service.addTipoAutomovelToCollectionIfMissing([], tipoAutomovel);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tipoAutomovel);
      });

      it('should not add a TipoAutomovel to an array that contains it', () => {
        const tipoAutomovel: ITipoAutomovel = sampleWithRequiredData;
        const tipoAutomovelCollection: ITipoAutomovel[] = [
          {
            ...tipoAutomovel,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTipoAutomovelToCollectionIfMissing(tipoAutomovelCollection, tipoAutomovel);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TipoAutomovel to an array that doesn't contain it", () => {
        const tipoAutomovel: ITipoAutomovel = sampleWithRequiredData;
        const tipoAutomovelCollection: ITipoAutomovel[] = [sampleWithPartialData];
        expectedResult = service.addTipoAutomovelToCollectionIfMissing(tipoAutomovelCollection, tipoAutomovel);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tipoAutomovel);
      });

      it('should add only unique TipoAutomovel to an array', () => {
        const tipoAutomovelArray: ITipoAutomovel[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const tipoAutomovelCollection: ITipoAutomovel[] = [sampleWithRequiredData];
        expectedResult = service.addTipoAutomovelToCollectionIfMissing(tipoAutomovelCollection, ...tipoAutomovelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tipoAutomovel: ITipoAutomovel = sampleWithRequiredData;
        const tipoAutomovel2: ITipoAutomovel = sampleWithPartialData;
        expectedResult = service.addTipoAutomovelToCollectionIfMissing([], tipoAutomovel, tipoAutomovel2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tipoAutomovel);
        expect(expectedResult).toContain(tipoAutomovel2);
      });

      it('should accept null and undefined values', () => {
        const tipoAutomovel: ITipoAutomovel = sampleWithRequiredData;
        expectedResult = service.addTipoAutomovelToCollectionIfMissing([], null, tipoAutomovel, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tipoAutomovel);
      });

      it('should return initial array if no TipoAutomovel is added', () => {
        const tipoAutomovelCollection: ITipoAutomovel[] = [sampleWithRequiredData];
        expectedResult = service.addTipoAutomovelToCollectionIfMissing(tipoAutomovelCollection, undefined, null);
        expect(expectedResult).toEqual(tipoAutomovelCollection);
      });
    });

    describe('compareTipoAutomovel', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTipoAutomovel(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.compareTipoAutomovel(entity1, entity2);
        const compareResult2 = service.compareTipoAutomovel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.compareTipoAutomovel(entity1, entity2);
        const compareResult2 = service.compareTipoAutomovel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.compareTipoAutomovel(entity1, entity2);
        const compareResult2 = service.compareTipoAutomovel(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
