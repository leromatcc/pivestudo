import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IPontoAcesso } from '../ponto-acesso.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../ponto-acesso.test-samples';

import { PontoAcessoService } from './ponto-acesso.service';

const requireRestSample: IPontoAcesso = {
  ...sampleWithRequiredData,
};

describe('PontoAcesso Service', () => {
  let service: PontoAcessoService;
  let httpMock: HttpTestingController;
  let expectedResult: IPontoAcesso | IPontoAcesso[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(PontoAcessoService);
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

    it('should create a PontoAcesso', () => {
      const pontoAcesso = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pontoAcesso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PontoAcesso', () => {
      const pontoAcesso = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pontoAcesso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PontoAcesso', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PontoAcesso', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PontoAcesso', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPontoAcessoToCollectionIfMissing', () => {
      it('should add a PontoAcesso to an empty array', () => {
        const pontoAcesso: IPontoAcesso = sampleWithRequiredData;
        expectedResult = service.addPontoAcessoToCollectionIfMissing([], pontoAcesso);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pontoAcesso);
      });

      it('should not add a PontoAcesso to an array that contains it', () => {
        const pontoAcesso: IPontoAcesso = sampleWithRequiredData;
        const pontoAcessoCollection: IPontoAcesso[] = [
          {
            ...pontoAcesso,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPontoAcessoToCollectionIfMissing(pontoAcessoCollection, pontoAcesso);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PontoAcesso to an array that doesn't contain it", () => {
        const pontoAcesso: IPontoAcesso = sampleWithRequiredData;
        const pontoAcessoCollection: IPontoAcesso[] = [sampleWithPartialData];
        expectedResult = service.addPontoAcessoToCollectionIfMissing(pontoAcessoCollection, pontoAcesso);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pontoAcesso);
      });

      it('should add only unique PontoAcesso to an array', () => {
        const pontoAcessoArray: IPontoAcesso[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pontoAcessoCollection: IPontoAcesso[] = [sampleWithRequiredData];
        expectedResult = service.addPontoAcessoToCollectionIfMissing(pontoAcessoCollection, ...pontoAcessoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pontoAcesso: IPontoAcesso = sampleWithRequiredData;
        const pontoAcesso2: IPontoAcesso = sampleWithPartialData;
        expectedResult = service.addPontoAcessoToCollectionIfMissing([], pontoAcesso, pontoAcesso2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pontoAcesso);
        expect(expectedResult).toContain(pontoAcesso2);
      });

      it('should accept null and undefined values', () => {
        const pontoAcesso: IPontoAcesso = sampleWithRequiredData;
        expectedResult = service.addPontoAcessoToCollectionIfMissing([], null, pontoAcesso, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pontoAcesso);
      });

      it('should return initial array if no PontoAcesso is added', () => {
        const pontoAcessoCollection: IPontoAcesso[] = [sampleWithRequiredData];
        expectedResult = service.addPontoAcessoToCollectionIfMissing(pontoAcessoCollection, undefined, null);
        expect(expectedResult).toEqual(pontoAcessoCollection);
      });
    });

    describe('comparePontoAcesso', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePontoAcesso(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.comparePontoAcesso(entity1, entity2);
        const compareResult2 = service.comparePontoAcesso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.comparePontoAcesso(entity1, entity2);
        const compareResult2 = service.comparePontoAcesso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.comparePontoAcesso(entity1, entity2);
        const compareResult2 = service.comparePontoAcesso(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
