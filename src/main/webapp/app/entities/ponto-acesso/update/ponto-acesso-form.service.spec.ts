import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../ponto-acesso.test-samples';

import { PontoAcessoFormService } from './ponto-acesso-form.service';

describe('PontoAcesso Form Service', () => {
  let service: PontoAcessoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PontoAcessoFormService);
  });

  describe('Service methods', () => {
    describe('createPontoAcessoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPontoAcessoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
            estabelecimento: expect.any(Object),
          }),
        );
      });

      it('passing IPontoAcesso should create a new form with FormGroup', () => {
        const formGroup = service.createPontoAcessoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
            estabelecimento: expect.any(Object),
          }),
        );
      });
    });

    describe('getPontoAcesso', () => {
      it('should return NewPontoAcesso for default PontoAcesso initial value', () => {
        const formGroup = service.createPontoAcessoFormGroup(sampleWithNewData);

        const pontoAcesso = service.getPontoAcesso(formGroup) as any;

        expect(pontoAcesso).toMatchObject(sampleWithNewData);
      });

      it('should return NewPontoAcesso for empty PontoAcesso initial value', () => {
        const formGroup = service.createPontoAcessoFormGroup();

        const pontoAcesso = service.getPontoAcesso(formGroup) as any;

        expect(pontoAcesso).toMatchObject({});
      });

      it('should return IPontoAcesso', () => {
        const formGroup = service.createPontoAcessoFormGroup(sampleWithRequiredData);

        const pontoAcesso = service.getPontoAcesso(formGroup) as any;

        expect(pontoAcesso).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPontoAcesso should not enable id FormControl', () => {
        const formGroup = service.createPontoAcessoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPontoAcesso should disable id FormControl', () => {
        const formGroup = service.createPontoAcessoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
