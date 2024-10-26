import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ISobre } from '../sobre.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../sobre.test-samples';

import { SobreService } from './sobre.service';

const requireRestSample: ISobre = {
  ...sampleWithRequiredData,
};

describe('Sobre Service', () => {
  let service: SobreService;
  let httpMock: HttpTestingController;
  let expectedResult: ISobre | ISobre[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(SobreService);
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

    it('should create a Sobre', () => {
      const sobre = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(sobre).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Sobre', () => {
      const sobre = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(sobre).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Sobre', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Sobre', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Sobre', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSobreToCollectionIfMissing', () => {
      it('should add a Sobre to an empty array', () => {
        const sobre: ISobre = sampleWithRequiredData;
        expectedResult = service.addSobreToCollectionIfMissing([], sobre);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sobre);
      });

      it('should not add a Sobre to an array that contains it', () => {
        const sobre: ISobre = sampleWithRequiredData;
        const sobreCollection: ISobre[] = [
          {
            ...sobre,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSobreToCollectionIfMissing(sobreCollection, sobre);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Sobre to an array that doesn't contain it", () => {
        const sobre: ISobre = sampleWithRequiredData;
        const sobreCollection: ISobre[] = [sampleWithPartialData];
        expectedResult = service.addSobreToCollectionIfMissing(sobreCollection, sobre);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sobre);
      });

      it('should add only unique Sobre to an array', () => {
        const sobreArray: ISobre[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const sobreCollection: ISobre[] = [sampleWithRequiredData];
        expectedResult = service.addSobreToCollectionIfMissing(sobreCollection, ...sobreArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sobre: ISobre = sampleWithRequiredData;
        const sobre2: ISobre = sampleWithPartialData;
        expectedResult = service.addSobreToCollectionIfMissing([], sobre, sobre2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sobre);
        expect(expectedResult).toContain(sobre2);
      });

      it('should accept null and undefined values', () => {
        const sobre: ISobre = sampleWithRequiredData;
        expectedResult = service.addSobreToCollectionIfMissing([], null, sobre, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sobre);
      });

      it('should return initial array if no Sobre is added', () => {
        const sobreCollection: ISobre[] = [sampleWithRequiredData];
        expectedResult = service.addSobreToCollectionIfMissing(sobreCollection, undefined, null);
        expect(expectedResult).toEqual(sobreCollection);
      });
    });

    describe('compareSobre', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSobre(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSobre(entity1, entity2);
        const compareResult2 = service.compareSobre(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSobre(entity1, entity2);
        const compareResult2 = service.compareSobre(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSobre(entity1, entity2);
        const compareResult2 = service.compareSobre(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
