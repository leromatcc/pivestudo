import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IEstabelecimento } from '../estabelecimento.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../estabelecimento.test-samples';

import { EstabelecimentoService } from './estabelecimento.service';

const requireRestSample: IEstabelecimento = {
  ...sampleWithRequiredData,
};

describe('Estabelecimento Service', () => {
  let service: EstabelecimentoService;
  let httpMock: HttpTestingController;
  let expectedResult: IEstabelecimento | IEstabelecimento[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EstabelecimentoService);
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

    it('should create a Estabelecimento', () => {
      const estabelecimento = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(estabelecimento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Estabelecimento', () => {
      const estabelecimento = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(estabelecimento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Estabelecimento', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Estabelecimento', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Estabelecimento', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEstabelecimentoToCollectionIfMissing', () => {
      it('should add a Estabelecimento to an empty array', () => {
        const estabelecimento: IEstabelecimento = sampleWithRequiredData;
        expectedResult = service.addEstabelecimentoToCollectionIfMissing([], estabelecimento);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estabelecimento);
      });

      it('should not add a Estabelecimento to an array that contains it', () => {
        const estabelecimento: IEstabelecimento = sampleWithRequiredData;
        const estabelecimentoCollection: IEstabelecimento[] = [
          {
            ...estabelecimento,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEstabelecimentoToCollectionIfMissing(estabelecimentoCollection, estabelecimento);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Estabelecimento to an array that doesn't contain it", () => {
        const estabelecimento: IEstabelecimento = sampleWithRequiredData;
        const estabelecimentoCollection: IEstabelecimento[] = [sampleWithPartialData];
        expectedResult = service.addEstabelecimentoToCollectionIfMissing(estabelecimentoCollection, estabelecimento);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estabelecimento);
      });

      it('should add only unique Estabelecimento to an array', () => {
        const estabelecimentoArray: IEstabelecimento[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const estabelecimentoCollection: IEstabelecimento[] = [sampleWithRequiredData];
        expectedResult = service.addEstabelecimentoToCollectionIfMissing(estabelecimentoCollection, ...estabelecimentoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const estabelecimento: IEstabelecimento = sampleWithRequiredData;
        const estabelecimento2: IEstabelecimento = sampleWithPartialData;
        expectedResult = service.addEstabelecimentoToCollectionIfMissing([], estabelecimento, estabelecimento2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estabelecimento);
        expect(expectedResult).toContain(estabelecimento2);
      });

      it('should accept null and undefined values', () => {
        const estabelecimento: IEstabelecimento = sampleWithRequiredData;
        expectedResult = service.addEstabelecimentoToCollectionIfMissing([], null, estabelecimento, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estabelecimento);
      });

      it('should return initial array if no Estabelecimento is added', () => {
        const estabelecimentoCollection: IEstabelecimento[] = [sampleWithRequiredData];
        expectedResult = service.addEstabelecimentoToCollectionIfMissing(estabelecimentoCollection, undefined, null);
        expect(expectedResult).toEqual(estabelecimentoCollection);
      });
    });

    describe('compareEstabelecimento', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEstabelecimento(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.compareEstabelecimento(entity1, entity2);
        const compareResult2 = service.compareEstabelecimento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.compareEstabelecimento(entity1, entity2);
        const compareResult2 = service.compareEstabelecimento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.compareEstabelecimento(entity1, entity2);
        const compareResult2 = service.compareEstabelecimento(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
