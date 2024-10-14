import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAutomovel } from '../automovel.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../automovel.test-samples';

import { AutomovelService } from './automovel.service';

const requireRestSample: IAutomovel = {
  ...sampleWithRequiredData,
};

describe('Automovel Service', () => {
  let service: AutomovelService;
  let httpMock: HttpTestingController;
  let expectedResult: IAutomovel | IAutomovel[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AutomovelService);
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

    it('should create a Automovel', () => {
      const automovel = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(automovel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Automovel', () => {
      const automovel = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(automovel).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Automovel', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Automovel', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Automovel', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAutomovelToCollectionIfMissing', () => {
      it('should add a Automovel to an empty array', () => {
        const automovel: IAutomovel = sampleWithRequiredData;
        expectedResult = service.addAutomovelToCollectionIfMissing([], automovel);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(automovel);
      });

      it('should not add a Automovel to an array that contains it', () => {
        const automovel: IAutomovel = sampleWithRequiredData;
        const automovelCollection: IAutomovel[] = [
          {
            ...automovel,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAutomovelToCollectionIfMissing(automovelCollection, automovel);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Automovel to an array that doesn't contain it", () => {
        const automovel: IAutomovel = sampleWithRequiredData;
        const automovelCollection: IAutomovel[] = [sampleWithPartialData];
        expectedResult = service.addAutomovelToCollectionIfMissing(automovelCollection, automovel);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(automovel);
      });

      it('should add only unique Automovel to an array', () => {
        const automovelArray: IAutomovel[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const automovelCollection: IAutomovel[] = [sampleWithRequiredData];
        expectedResult = service.addAutomovelToCollectionIfMissing(automovelCollection, ...automovelArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const automovel: IAutomovel = sampleWithRequiredData;
        const automovel2: IAutomovel = sampleWithPartialData;
        expectedResult = service.addAutomovelToCollectionIfMissing([], automovel, automovel2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(automovel);
        expect(expectedResult).toContain(automovel2);
      });

      it('should accept null and undefined values', () => {
        const automovel: IAutomovel = sampleWithRequiredData;
        expectedResult = service.addAutomovelToCollectionIfMissing([], null, automovel, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(automovel);
      });

      it('should return initial array if no Automovel is added', () => {
        const automovelCollection: IAutomovel[] = [sampleWithRequiredData];
        expectedResult = service.addAutomovelToCollectionIfMissing(automovelCollection, undefined, null);
        expect(expectedResult).toEqual(automovelCollection);
      });
    });

    describe('compareAutomovel', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAutomovel(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.compareAutomovel(entity1, entity2);
        const compareResult2 = service.compareAutomovel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.compareAutomovel(entity1, entity2);
        const compareResult2 = service.compareAutomovel(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.compareAutomovel(entity1, entity2);
        const compareResult2 = service.compareAutomovel(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
