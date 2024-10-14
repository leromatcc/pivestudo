import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ILoteBlocoApartamento } from '../lote-bloco-apartamento.model';
import {
  sampleWithFullData,
  sampleWithNewData,
  sampleWithPartialData,
  sampleWithRequiredData,
} from '../lote-bloco-apartamento.test-samples';

import { LoteBlocoApartamentoService } from './lote-bloco-apartamento.service';

const requireRestSample: ILoteBlocoApartamento = {
  ...sampleWithRequiredData,
};

describe('LoteBlocoApartamento Service', () => {
  let service: LoteBlocoApartamentoService;
  let httpMock: HttpTestingController;
  let expectedResult: ILoteBlocoApartamento | ILoteBlocoApartamento[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(LoteBlocoApartamentoService);
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

    it('should create a LoteBlocoApartamento', () => {
      const loteBlocoApartamento = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(loteBlocoApartamento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LoteBlocoApartamento', () => {
      const loteBlocoApartamento = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(loteBlocoApartamento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LoteBlocoApartamento', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LoteBlocoApartamento', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LoteBlocoApartamento', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLoteBlocoApartamentoToCollectionIfMissing', () => {
      it('should add a LoteBlocoApartamento to an empty array', () => {
        const loteBlocoApartamento: ILoteBlocoApartamento = sampleWithRequiredData;
        expectedResult = service.addLoteBlocoApartamentoToCollectionIfMissing([], loteBlocoApartamento);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(loteBlocoApartamento);
      });

      it('should not add a LoteBlocoApartamento to an array that contains it', () => {
        const loteBlocoApartamento: ILoteBlocoApartamento = sampleWithRequiredData;
        const loteBlocoApartamentoCollection: ILoteBlocoApartamento[] = [
          {
            ...loteBlocoApartamento,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLoteBlocoApartamentoToCollectionIfMissing(loteBlocoApartamentoCollection, loteBlocoApartamento);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LoteBlocoApartamento to an array that doesn't contain it", () => {
        const loteBlocoApartamento: ILoteBlocoApartamento = sampleWithRequiredData;
        const loteBlocoApartamentoCollection: ILoteBlocoApartamento[] = [sampleWithPartialData];
        expectedResult = service.addLoteBlocoApartamentoToCollectionIfMissing(loteBlocoApartamentoCollection, loteBlocoApartamento);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(loteBlocoApartamento);
      });

      it('should add only unique LoteBlocoApartamento to an array', () => {
        const loteBlocoApartamentoArray: ILoteBlocoApartamento[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const loteBlocoApartamentoCollection: ILoteBlocoApartamento[] = [sampleWithRequiredData];
        expectedResult = service.addLoteBlocoApartamentoToCollectionIfMissing(loteBlocoApartamentoCollection, ...loteBlocoApartamentoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const loteBlocoApartamento: ILoteBlocoApartamento = sampleWithRequiredData;
        const loteBlocoApartamento2: ILoteBlocoApartamento = sampleWithPartialData;
        expectedResult = service.addLoteBlocoApartamentoToCollectionIfMissing([], loteBlocoApartamento, loteBlocoApartamento2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(loteBlocoApartamento);
        expect(expectedResult).toContain(loteBlocoApartamento2);
      });

      it('should accept null and undefined values', () => {
        const loteBlocoApartamento: ILoteBlocoApartamento = sampleWithRequiredData;
        expectedResult = service.addLoteBlocoApartamentoToCollectionIfMissing([], null, loteBlocoApartamento, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(loteBlocoApartamento);
      });

      it('should return initial array if no LoteBlocoApartamento is added', () => {
        const loteBlocoApartamentoCollection: ILoteBlocoApartamento[] = [sampleWithRequiredData];
        expectedResult = service.addLoteBlocoApartamentoToCollectionIfMissing(loteBlocoApartamentoCollection, undefined, null);
        expect(expectedResult).toEqual(loteBlocoApartamentoCollection);
      });
    });

    describe('compareLoteBlocoApartamento', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLoteBlocoApartamento(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.compareLoteBlocoApartamento(entity1, entity2);
        const compareResult2 = service.compareLoteBlocoApartamento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.compareLoteBlocoApartamento(entity1, entity2);
        const compareResult2 = service.compareLoteBlocoApartamento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.compareLoteBlocoApartamento(entity1, entity2);
        const compareResult2 = service.compareLoteBlocoApartamento(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
