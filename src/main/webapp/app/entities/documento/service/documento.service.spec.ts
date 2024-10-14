import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IDocumento } from '../documento.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../documento.test-samples';

import { DocumentoService } from './documento.service';

const requireRestSample: IDocumento = {
  ...sampleWithRequiredData,
};

describe('Documento Service', () => {
  let service: DocumentoService;
  let httpMock: HttpTestingController;
  let expectedResult: IDocumento | IDocumento[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(DocumentoService);
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

    it('should create a Documento', () => {
      const documento = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(documento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Documento', () => {
      const documento = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(documento).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Documento', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Documento', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Documento', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDocumentoToCollectionIfMissing', () => {
      it('should add a Documento to an empty array', () => {
        const documento: IDocumento = sampleWithRequiredData;
        expectedResult = service.addDocumentoToCollectionIfMissing([], documento);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(documento);
      });

      it('should not add a Documento to an array that contains it', () => {
        const documento: IDocumento = sampleWithRequiredData;
        const documentoCollection: IDocumento[] = [
          {
            ...documento,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDocumentoToCollectionIfMissing(documentoCollection, documento);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Documento to an array that doesn't contain it", () => {
        const documento: IDocumento = sampleWithRequiredData;
        const documentoCollection: IDocumento[] = [sampleWithPartialData];
        expectedResult = service.addDocumentoToCollectionIfMissing(documentoCollection, documento);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(documento);
      });

      it('should add only unique Documento to an array', () => {
        const documentoArray: IDocumento[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const documentoCollection: IDocumento[] = [sampleWithRequiredData];
        expectedResult = service.addDocumentoToCollectionIfMissing(documentoCollection, ...documentoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const documento: IDocumento = sampleWithRequiredData;
        const documento2: IDocumento = sampleWithPartialData;
        expectedResult = service.addDocumentoToCollectionIfMissing([], documento, documento2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(documento);
        expect(expectedResult).toContain(documento2);
      });

      it('should accept null and undefined values', () => {
        const documento: IDocumento = sampleWithRequiredData;
        expectedResult = service.addDocumentoToCollectionIfMissing([], null, documento, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(documento);
      });

      it('should return initial array if no Documento is added', () => {
        const documentoCollection: IDocumento[] = [sampleWithRequiredData];
        expectedResult = service.addDocumentoToCollectionIfMissing(documentoCollection, undefined, null);
        expect(expectedResult).toEqual(documentoCollection);
      });
    });

    describe('compareDocumento', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDocumento(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.compareDocumento(entity1, entity2);
        const compareResult2 = service.compareDocumento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.compareDocumento(entity1, entity2);
        const compareResult2 = service.compareDocumento(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.compareDocumento(entity1, entity2);
        const compareResult2 = service.compareDocumento(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
