import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../autorizacao-acesso.test-samples';

import { AutorizacaoAcessoFormService } from './autorizacao-acesso-form.service';

describe('AutorizacaoAcesso Form Service', () => {
  let service: AutorizacaoAcessoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutorizacaoAcessoFormService);
  });

  describe('Service methods', () => {
    describe('createAutorizacaoAcessoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAutorizacaoAcessoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
            dataInicial: expect.any(Object),
            dataFinal: expect.any(Object),
            status: expect.any(Object),
            pessoa: expect.any(Object),
            estabelecimento: expect.any(Object),
          }),
        );
      });

      it('passing IAutorizacaoAcesso should create a new form with FormGroup', () => {
        const formGroup = service.createAutorizacaoAcessoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
            dataInicial: expect.any(Object),
            dataFinal: expect.any(Object),
            status: expect.any(Object),
            pessoa: expect.any(Object),
            estabelecimento: expect.any(Object),
          }),
        );
      });
    });

    describe('getAutorizacaoAcesso', () => {
      it('should return NewAutorizacaoAcesso for default AutorizacaoAcesso initial value', () => {
        const formGroup = service.createAutorizacaoAcessoFormGroup(sampleWithNewData);

        const autorizacaoAcesso = service.getAutorizacaoAcesso(formGroup) as any;

        expect(autorizacaoAcesso).toMatchObject(sampleWithNewData);
      });

      it('should return NewAutorizacaoAcesso for empty AutorizacaoAcesso initial value', () => {
        const formGroup = service.createAutorizacaoAcessoFormGroup();

        const autorizacaoAcesso = service.getAutorizacaoAcesso(formGroup) as any;

        expect(autorizacaoAcesso).toMatchObject({});
      });

      it('should return IAutorizacaoAcesso', () => {
        const formGroup = service.createAutorizacaoAcessoFormGroup(sampleWithRequiredData);

        const autorizacaoAcesso = service.getAutorizacaoAcesso(formGroup) as any;

        expect(autorizacaoAcesso).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAutorizacaoAcesso should not enable id FormControl', () => {
        const formGroup = service.createAutorizacaoAcessoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAutorizacaoAcesso should disable id FormControl', () => {
        const formGroup = service.createAutorizacaoAcessoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
