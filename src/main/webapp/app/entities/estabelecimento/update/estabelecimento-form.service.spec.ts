import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../estabelecimento.test-samples';

import { EstabelecimentoFormService } from './estabelecimento-form.service';

describe('Estabelecimento Form Service', () => {
  let service: EstabelecimentoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstabelecimentoFormService);
  });

  describe('Service methods', () => {
    describe('createEstabelecimentoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEstabelecimentoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
            endereco: expect.any(Object),
          }),
        );
      });

      it('passing IEstabelecimento should create a new form with FormGroup', () => {
        const formGroup = service.createEstabelecimentoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
            endereco: expect.any(Object),
          }),
        );
      });
    });

    describe('getEstabelecimento', () => {
      it('should return NewEstabelecimento for default Estabelecimento initial value', () => {
        const formGroup = service.createEstabelecimentoFormGroup(sampleWithNewData);

        const estabelecimento = service.getEstabelecimento(formGroup) as any;

        expect(estabelecimento).toMatchObject(sampleWithNewData);
      });

      it('should return NewEstabelecimento for empty Estabelecimento initial value', () => {
        const formGroup = service.createEstabelecimentoFormGroup();

        const estabelecimento = service.getEstabelecimento(formGroup) as any;

        expect(estabelecimento).toMatchObject({});
      });

      it('should return IEstabelecimento', () => {
        const formGroup = service.createEstabelecimentoFormGroup(sampleWithRequiredData);

        const estabelecimento = service.getEstabelecimento(formGroup) as any;

        expect(estabelecimento).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEstabelecimento should not enable id FormControl', () => {
        const formGroup = service.createEstabelecimentoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEstabelecimento should disable id FormControl', () => {
        const formGroup = service.createEstabelecimentoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
