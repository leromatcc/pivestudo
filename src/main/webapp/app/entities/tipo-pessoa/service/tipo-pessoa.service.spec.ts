import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITipoPessoa } from '../tipo-pessoa.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../tipo-pessoa.test-samples';

import { TipoPessoaService } from './tipo-pessoa.service';

const requireRestSample: ITipoPessoa = {
  ...sampleWithRequiredData,
};

describe('TipoPessoa Service', () => {
  let service: TipoPessoaService;
  let httpMock: HttpTestingController;
  let expectedResult: ITipoPessoa | ITipoPessoa[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TipoPessoaService);
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

    it('should create a TipoPessoa', () => {
      const tipoPessoa = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(tipoPessoa).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TipoPessoa', () => {
      const tipoPessoa = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(tipoPessoa).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TipoPessoa', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TipoPessoa', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a TipoPessoa', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTipoPessoaToCollectionIfMissing', () => {
      it('should add a TipoPessoa to an empty array', () => {
        const tipoPessoa: ITipoPessoa = sampleWithRequiredData;
        expectedResult = service.addTipoPessoaToCollectionIfMissing([], tipoPessoa);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tipoPessoa);
      });

      it('should not add a TipoPessoa to an array that contains it', () => {
        const tipoPessoa: ITipoPessoa = sampleWithRequiredData;
        const tipoPessoaCollection: ITipoPessoa[] = [
          {
            ...tipoPessoa,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTipoPessoaToCollectionIfMissing(tipoPessoaCollection, tipoPessoa);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TipoPessoa to an array that doesn't contain it", () => {
        const tipoPessoa: ITipoPessoa = sampleWithRequiredData;
        const tipoPessoaCollection: ITipoPessoa[] = [sampleWithPartialData];
        expectedResult = service.addTipoPessoaToCollectionIfMissing(tipoPessoaCollection, tipoPessoa);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tipoPessoa);
      });

      it('should add only unique TipoPessoa to an array', () => {
        const tipoPessoaArray: ITipoPessoa[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const tipoPessoaCollection: ITipoPessoa[] = [sampleWithRequiredData];
        expectedResult = service.addTipoPessoaToCollectionIfMissing(tipoPessoaCollection, ...tipoPessoaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tipoPessoa: ITipoPessoa = sampleWithRequiredData;
        const tipoPessoa2: ITipoPessoa = sampleWithPartialData;
        expectedResult = service.addTipoPessoaToCollectionIfMissing([], tipoPessoa, tipoPessoa2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tipoPessoa);
        expect(expectedResult).toContain(tipoPessoa2);
      });

      it('should accept null and undefined values', () => {
        const tipoPessoa: ITipoPessoa = sampleWithRequiredData;
        expectedResult = service.addTipoPessoaToCollectionIfMissing([], null, tipoPessoa, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tipoPessoa);
      });

      it('should return initial array if no TipoPessoa is added', () => {
        const tipoPessoaCollection: ITipoPessoa[] = [sampleWithRequiredData];
        expectedResult = service.addTipoPessoaToCollectionIfMissing(tipoPessoaCollection, undefined, null);
        expect(expectedResult).toEqual(tipoPessoaCollection);
      });
    });

    describe('compareTipoPessoa', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTipoPessoa(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTipoPessoa(entity1, entity2);
        const compareResult2 = service.compareTipoPessoa(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTipoPessoa(entity1, entity2);
        const compareResult2 = service.compareTipoPessoa(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTipoPessoa(entity1, entity2);
        const compareResult2 = service.compareTipoPessoa(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
