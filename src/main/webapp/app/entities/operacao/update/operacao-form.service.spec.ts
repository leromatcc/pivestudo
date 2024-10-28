import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../operacao.test-samples';

import { OperacaoFormService } from './operacao-form.service';

describe('Operacao Form Service', () => {
  let service: OperacaoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperacaoFormService);
  });

  describe('Service methods', () => {
    describe('createOperacaoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createOperacaoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            arquivoImagem: expect.any(Object),
          }),
        );
      });

      it('passing IOperacao should create a new form with FormGroup', () => {
        const formGroup = service.createOperacaoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            arquivoImagem: expect.any(Object),
          }),
        );
      });
    });

    describe('getOperacao', () => {
      it('should return NewOperacao for default Operacao initial value', () => {
        const formGroup = service.createOperacaoFormGroup(sampleWithNewData);

        const operacao = service.getOperacao(formGroup) as any;

        expect(operacao).toMatchObject(sampleWithNewData);
      });

      it('should return NewOperacao for empty Operacao initial value', () => {
        const formGroup = service.createOperacaoFormGroup();

        const operacao = service.getOperacao(formGroup) as any;

        expect(operacao).toMatchObject({});
      });

      it('should return IOperacao', () => {
        const formGroup = service.createOperacaoFormGroup(sampleWithRequiredData);

        const operacao = service.getOperacao(formGroup) as any;

        expect(operacao).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IOperacao should not enable id FormControl', () => {
        const formGroup = service.createOperacaoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewOperacao should disable id FormControl', () => {
        const formGroup = service.createOperacaoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
