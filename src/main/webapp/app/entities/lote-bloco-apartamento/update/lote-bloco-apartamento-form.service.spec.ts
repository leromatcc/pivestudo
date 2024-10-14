import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../lote-bloco-apartamento.test-samples';

import { LoteBlocoApartamentoFormService } from './lote-bloco-apartamento-form.service';

describe('LoteBlocoApartamento Form Service', () => {
  let service: LoteBlocoApartamentoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoteBlocoApartamentoFormService);
  });

  describe('Service methods', () => {
    describe('createLoteBlocoApartamentoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLoteBlocoApartamentoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            bloco: expect.any(Object),
            andar: expect.any(Object),
            numero: expect.any(Object),
            endereco: expect.any(Object),
            pessoa: expect.any(Object),
          }),
        );
      });

      it('passing ILoteBlocoApartamento should create a new form with FormGroup', () => {
        const formGroup = service.createLoteBlocoApartamentoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            bloco: expect.any(Object),
            andar: expect.any(Object),
            numero: expect.any(Object),
            endereco: expect.any(Object),
            pessoa: expect.any(Object),
          }),
        );
      });
    });

    describe('getLoteBlocoApartamento', () => {
      it('should return NewLoteBlocoApartamento for default LoteBlocoApartamento initial value', () => {
        const formGroup = service.createLoteBlocoApartamentoFormGroup(sampleWithNewData);

        const loteBlocoApartamento = service.getLoteBlocoApartamento(formGroup) as any;

        expect(loteBlocoApartamento).toMatchObject(sampleWithNewData);
      });

      it('should return NewLoteBlocoApartamento for empty LoteBlocoApartamento initial value', () => {
        const formGroup = service.createLoteBlocoApartamentoFormGroup();

        const loteBlocoApartamento = service.getLoteBlocoApartamento(formGroup) as any;

        expect(loteBlocoApartamento).toMatchObject({});
      });

      it('should return ILoteBlocoApartamento', () => {
        const formGroup = service.createLoteBlocoApartamentoFormGroup(sampleWithRequiredData);

        const loteBlocoApartamento = service.getLoteBlocoApartamento(formGroup) as any;

        expect(loteBlocoApartamento).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILoteBlocoApartamento should not enable id FormControl', () => {
        const formGroup = service.createLoteBlocoApartamentoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLoteBlocoApartamento should disable id FormControl', () => {
        const formGroup = service.createLoteBlocoApartamentoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
