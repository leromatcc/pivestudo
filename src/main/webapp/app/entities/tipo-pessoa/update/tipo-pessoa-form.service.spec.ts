import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../tipo-pessoa.test-samples';

import { TipoPessoaFormService } from './tipo-pessoa-form.service';

describe('TipoPessoa Form Service', () => {
  let service: TipoPessoaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoPessoaFormService);
  });

  describe('Service methods', () => {
    describe('createTipoPessoaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTipoPessoaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
            grupo: expect.any(Object),
          }),
        );
      });

      it('passing ITipoPessoa should create a new form with FormGroup', () => {
        const formGroup = service.createTipoPessoaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
            grupo: expect.any(Object),
          }),
        );
      });
    });

    describe('getTipoPessoa', () => {
      it('should return NewTipoPessoa for default TipoPessoa initial value', () => {
        const formGroup = service.createTipoPessoaFormGroup(sampleWithNewData);

        const tipoPessoa = service.getTipoPessoa(formGroup) as any;

        expect(tipoPessoa).toMatchObject(sampleWithNewData);
      });

      it('should return NewTipoPessoa for empty TipoPessoa initial value', () => {
        const formGroup = service.createTipoPessoaFormGroup();

        const tipoPessoa = service.getTipoPessoa(formGroup) as any;

        expect(tipoPessoa).toMatchObject({});
      });

      it('should return ITipoPessoa', () => {
        const formGroup = service.createTipoPessoaFormGroup(sampleWithRequiredData);

        const tipoPessoa = service.getTipoPessoa(formGroup) as any;

        expect(tipoPessoa).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITipoPessoa should not enable id FormControl', () => {
        const formGroup = service.createTipoPessoaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTipoPessoa should disable id FormControl', () => {
        const formGroup = service.createTipoPessoaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
