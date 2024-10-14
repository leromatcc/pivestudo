import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IAutorizacaoAcesso } from '../autorizacao-acesso.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../autorizacao-acesso.test-samples';

import { AutorizacaoAcessoService, RestAutorizacaoAcesso } from './autorizacao-acesso.service';

const requireRestSample: RestAutorizacaoAcesso = {
  ...sampleWithRequiredData,
  dataInicial: sampleWithRequiredData.dataInicial?.toJSON(),
  dataFinal: sampleWithRequiredData.dataFinal?.toJSON(),
};

describe('AutorizacaoAcesso Service', () => {
  let service: AutorizacaoAcessoService;
  let httpMock: HttpTestingController;
  let expectedResult: IAutorizacaoAcesso | IAutorizacaoAcesso[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(AutorizacaoAcessoService);
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

    it('should create a AutorizacaoAcesso', () => {
      const autorizacaoAcesso = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(autorizacaoAcesso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AutorizacaoAcesso', () => {
      const autorizacaoAcesso = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(autorizacaoAcesso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AutorizacaoAcesso', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AutorizacaoAcesso', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AutorizacaoAcesso', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAutorizacaoAcessoToCollectionIfMissing', () => {
      it('should add a AutorizacaoAcesso to an empty array', () => {
        const autorizacaoAcesso: IAutorizacaoAcesso = sampleWithRequiredData;
        expectedResult = service.addAutorizacaoAcessoToCollectionIfMissing([], autorizacaoAcesso);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(autorizacaoAcesso);
      });

      it('should not add a AutorizacaoAcesso to an array that contains it', () => {
        const autorizacaoAcesso: IAutorizacaoAcesso = sampleWithRequiredData;
        const autorizacaoAcessoCollection: IAutorizacaoAcesso[] = [
          {
            ...autorizacaoAcesso,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAutorizacaoAcessoToCollectionIfMissing(autorizacaoAcessoCollection, autorizacaoAcesso);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AutorizacaoAcesso to an array that doesn't contain it", () => {
        const autorizacaoAcesso: IAutorizacaoAcesso = sampleWithRequiredData;
        const autorizacaoAcessoCollection: IAutorizacaoAcesso[] = [sampleWithPartialData];
        expectedResult = service.addAutorizacaoAcessoToCollectionIfMissing(autorizacaoAcessoCollection, autorizacaoAcesso);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(autorizacaoAcesso);
      });

      it('should add only unique AutorizacaoAcesso to an array', () => {
        const autorizacaoAcessoArray: IAutorizacaoAcesso[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const autorizacaoAcessoCollection: IAutorizacaoAcesso[] = [sampleWithRequiredData];
        expectedResult = service.addAutorizacaoAcessoToCollectionIfMissing(autorizacaoAcessoCollection, ...autorizacaoAcessoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const autorizacaoAcesso: IAutorizacaoAcesso = sampleWithRequiredData;
        const autorizacaoAcesso2: IAutorizacaoAcesso = sampleWithPartialData;
        expectedResult = service.addAutorizacaoAcessoToCollectionIfMissing([], autorizacaoAcesso, autorizacaoAcesso2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(autorizacaoAcesso);
        expect(expectedResult).toContain(autorizacaoAcesso2);
      });

      it('should accept null and undefined values', () => {
        const autorizacaoAcesso: IAutorizacaoAcesso = sampleWithRequiredData;
        expectedResult = service.addAutorizacaoAcessoToCollectionIfMissing([], null, autorizacaoAcesso, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(autorizacaoAcesso);
      });

      it('should return initial array if no AutorizacaoAcesso is added', () => {
        const autorizacaoAcessoCollection: IAutorizacaoAcesso[] = [sampleWithRequiredData];
        expectedResult = service.addAutorizacaoAcessoToCollectionIfMissing(autorizacaoAcessoCollection, undefined, null);
        expect(expectedResult).toEqual(autorizacaoAcessoCollection);
      });
    });

    describe('compareAutorizacaoAcesso', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAutorizacaoAcesso(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.compareAutorizacaoAcesso(entity1, entity2);
        const compareResult2 = service.compareAutorizacaoAcesso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.compareAutorizacaoAcesso(entity1, entity2);
        const compareResult2 = service.compareAutorizacaoAcesso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.compareAutorizacaoAcesso(entity1, entity2);
        const compareResult2 = service.compareAutorizacaoAcesso(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
