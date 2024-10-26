import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IOperacao } from '../operacao.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../operacao.test-samples';

import { OperacaoService } from './operacao.service';

const requireRestSample: IOperacao = {
  ...sampleWithRequiredData,
};

describe('Operacao Service', () => {
  let service: OperacaoService;
  let httpMock: HttpTestingController;
  let expectedResult: IOperacao | IOperacao[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(OperacaoService);
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

    it('should create a Operacao', () => {
      const operacao = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(operacao).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Operacao', () => {
      const operacao = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(operacao).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Operacao', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Operacao', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Operacao', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOperacaoToCollectionIfMissing', () => {
      it('should add a Operacao to an empty array', () => {
        const operacao: IOperacao = sampleWithRequiredData;
        expectedResult = service.addOperacaoToCollectionIfMissing([], operacao);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(operacao);
      });

      it('should not add a Operacao to an array that contains it', () => {
        const operacao: IOperacao = sampleWithRequiredData;
        const operacaoCollection: IOperacao[] = [
          {
            ...operacao,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOperacaoToCollectionIfMissing(operacaoCollection, operacao);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Operacao to an array that doesn't contain it", () => {
        const operacao: IOperacao = sampleWithRequiredData;
        const operacaoCollection: IOperacao[] = [sampleWithPartialData];
        expectedResult = service.addOperacaoToCollectionIfMissing(operacaoCollection, operacao);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(operacao);
      });

      it('should add only unique Operacao to an array', () => {
        const operacaoArray: IOperacao[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const operacaoCollection: IOperacao[] = [sampleWithRequiredData];
        expectedResult = service.addOperacaoToCollectionIfMissing(operacaoCollection, ...operacaoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const operacao: IOperacao = sampleWithRequiredData;
        const operacao2: IOperacao = sampleWithPartialData;
        expectedResult = service.addOperacaoToCollectionIfMissing([], operacao, operacao2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(operacao);
        expect(expectedResult).toContain(operacao2);
      });

      it('should accept null and undefined values', () => {
        const operacao: IOperacao = sampleWithRequiredData;
        expectedResult = service.addOperacaoToCollectionIfMissing([], null, operacao, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(operacao);
      });

      it('should return initial array if no Operacao is added', () => {
        const operacaoCollection: IOperacao[] = [sampleWithRequiredData];
        expectedResult = service.addOperacaoToCollectionIfMissing(operacaoCollection, undefined, null);
        expect(expectedResult).toEqual(operacaoCollection);
      });
    });

    describe('compareOperacao', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOperacao(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOperacao(entity1, entity2);
        const compareResult2 = service.compareOperacao(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOperacao(entity1, entity2);
        const compareResult2 = service.compareOperacao(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOperacao(entity1, entity2);
        const compareResult2 = service.compareOperacao(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
