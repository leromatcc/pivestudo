import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IRegistroAcesso } from '../registro-acesso.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../registro-acesso.test-samples';

import { RegistroAcessoService, RestRegistroAcesso } from './registro-acesso.service';

const requireRestSample: RestRegistroAcesso = {
  ...sampleWithRequiredData,
  dataHora: sampleWithRequiredData.dataHora?.toJSON(),
};

describe('RegistroAcesso Service', () => {
  let service: RegistroAcessoService;
  let httpMock: HttpTestingController;
  let expectedResult: IRegistroAcesso | IRegistroAcesso[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(RegistroAcessoService);
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

    it('should create a RegistroAcesso', () => {
      const registroAcesso = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(registroAcesso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RegistroAcesso', () => {
      const registroAcesso = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(registroAcesso).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RegistroAcesso', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RegistroAcesso', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a RegistroAcesso', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addRegistroAcessoToCollectionIfMissing', () => {
      it('should add a RegistroAcesso to an empty array', () => {
        const registroAcesso: IRegistroAcesso = sampleWithRequiredData;
        expectedResult = service.addRegistroAcessoToCollectionIfMissing([], registroAcesso);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(registroAcesso);
      });

      it('should not add a RegistroAcesso to an array that contains it', () => {
        const registroAcesso: IRegistroAcesso = sampleWithRequiredData;
        const registroAcessoCollection: IRegistroAcesso[] = [
          {
            ...registroAcesso,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addRegistroAcessoToCollectionIfMissing(registroAcessoCollection, registroAcesso);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RegistroAcesso to an array that doesn't contain it", () => {
        const registroAcesso: IRegistroAcesso = sampleWithRequiredData;
        const registroAcessoCollection: IRegistroAcesso[] = [sampleWithPartialData];
        expectedResult = service.addRegistroAcessoToCollectionIfMissing(registroAcessoCollection, registroAcesso);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(registroAcesso);
      });

      it('should add only unique RegistroAcesso to an array', () => {
        const registroAcessoArray: IRegistroAcesso[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const registroAcessoCollection: IRegistroAcesso[] = [sampleWithRequiredData];
        expectedResult = service.addRegistroAcessoToCollectionIfMissing(registroAcessoCollection, ...registroAcessoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const registroAcesso: IRegistroAcesso = sampleWithRequiredData;
        const registroAcesso2: IRegistroAcesso = sampleWithPartialData;
        expectedResult = service.addRegistroAcessoToCollectionIfMissing([], registroAcesso, registroAcesso2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(registroAcesso);
        expect(expectedResult).toContain(registroAcesso2);
      });

      it('should accept null and undefined values', () => {
        const registroAcesso: IRegistroAcesso = sampleWithRequiredData;
        expectedResult = service.addRegistroAcessoToCollectionIfMissing([], null, registroAcesso, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(registroAcesso);
      });

      it('should return initial array if no RegistroAcesso is added', () => {
        const registroAcessoCollection: IRegistroAcesso[] = [sampleWithRequiredData];
        expectedResult = service.addRegistroAcessoToCollectionIfMissing(registroAcessoCollection, undefined, null);
        expect(expectedResult).toEqual(registroAcessoCollection);
      });
    });

    describe('compareRegistroAcesso', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareRegistroAcesso(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.compareRegistroAcesso(entity1, entity2);
        const compareResult2 = service.compareRegistroAcesso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.compareRegistroAcesso(entity1, entity2);
        const compareResult2 = service.compareRegistroAcesso(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.compareRegistroAcesso(entity1, entity2);
        const compareResult2 = service.compareRegistroAcesso(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
