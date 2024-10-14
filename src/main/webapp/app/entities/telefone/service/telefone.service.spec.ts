import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITelefone } from '../telefone.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../telefone.test-samples';

import { TelefoneService } from './telefone.service';

const requireRestSample: ITelefone = {
  ...sampleWithRequiredData,
};

describe('Telefone Service', () => {
  let service: TelefoneService;
  let httpMock: HttpTestingController;
  let expectedResult: ITelefone | ITelefone[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TelefoneService);
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

    it('should create a Telefone', () => {
      const telefone = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(telefone).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Telefone', () => {
      const telefone = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(telefone).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Telefone', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Telefone', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Telefone', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTelefoneToCollectionIfMissing', () => {
      it('should add a Telefone to an empty array', () => {
        const telefone: ITelefone = sampleWithRequiredData;
        expectedResult = service.addTelefoneToCollectionIfMissing([], telefone);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(telefone);
      });

      it('should not add a Telefone to an array that contains it', () => {
        const telefone: ITelefone = sampleWithRequiredData;
        const telefoneCollection: ITelefone[] = [
          {
            ...telefone,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTelefoneToCollectionIfMissing(telefoneCollection, telefone);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Telefone to an array that doesn't contain it", () => {
        const telefone: ITelefone = sampleWithRequiredData;
        const telefoneCollection: ITelefone[] = [sampleWithPartialData];
        expectedResult = service.addTelefoneToCollectionIfMissing(telefoneCollection, telefone);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(telefone);
      });

      it('should add only unique Telefone to an array', () => {
        const telefoneArray: ITelefone[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const telefoneCollection: ITelefone[] = [sampleWithRequiredData];
        expectedResult = service.addTelefoneToCollectionIfMissing(telefoneCollection, ...telefoneArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const telefone: ITelefone = sampleWithRequiredData;
        const telefone2: ITelefone = sampleWithPartialData;
        expectedResult = service.addTelefoneToCollectionIfMissing([], telefone, telefone2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(telefone);
        expect(expectedResult).toContain(telefone2);
      });

      it('should accept null and undefined values', () => {
        const telefone: ITelefone = sampleWithRequiredData;
        expectedResult = service.addTelefoneToCollectionIfMissing([], null, telefone, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(telefone);
      });

      it('should return initial array if no Telefone is added', () => {
        const telefoneCollection: ITelefone[] = [sampleWithRequiredData];
        expectedResult = service.addTelefoneToCollectionIfMissing(telefoneCollection, undefined, null);
        expect(expectedResult).toEqual(telefoneCollection);
      });
    });

    describe('compareTelefone', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTelefone(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.compareTelefone(entity1, entity2);
        const compareResult2 = service.compareTelefone(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.compareTelefone(entity1, entity2);
        const compareResult2 = service.compareTelefone(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.compareTelefone(entity1, entity2);
        const compareResult2 = service.compareTelefone(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
