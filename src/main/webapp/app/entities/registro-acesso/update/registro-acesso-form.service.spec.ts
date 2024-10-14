import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../registro-acesso.test-samples';

import { RegistroAcessoFormService } from './registro-acesso-form.service';

describe('RegistroAcesso Form Service', () => {
  let service: RegistroAcessoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroAcessoFormService);
  });

  describe('Service methods', () => {
    describe('createRegistroAcessoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createRegistroAcessoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dataHora: expect.any(Object),
            cadeiaAnalisada: expect.any(Object),
            acessoAutorizado: expect.any(Object),
            pontoAcesso: expect.any(Object),
            automovel: expect.any(Object),
            autorizacaoAcesso: expect.any(Object),
          }),
        );
      });

      it('passing IRegistroAcesso should create a new form with FormGroup', () => {
        const formGroup = service.createRegistroAcessoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            dataHora: expect.any(Object),
            cadeiaAnalisada: expect.any(Object),
            acessoAutorizado: expect.any(Object),
            pontoAcesso: expect.any(Object),
            automovel: expect.any(Object),
            autorizacaoAcesso: expect.any(Object),
          }),
        );
      });
    });

    describe('getRegistroAcesso', () => {
      it('should return NewRegistroAcesso for default RegistroAcesso initial value', () => {
        const formGroup = service.createRegistroAcessoFormGroup(sampleWithNewData);

        const registroAcesso = service.getRegistroAcesso(formGroup) as any;

        expect(registroAcesso).toMatchObject(sampleWithNewData);
      });

      it('should return NewRegistroAcesso for empty RegistroAcesso initial value', () => {
        const formGroup = service.createRegistroAcessoFormGroup();

        const registroAcesso = service.getRegistroAcesso(formGroup) as any;

        expect(registroAcesso).toMatchObject({});
      });

      it('should return IRegistroAcesso', () => {
        const formGroup = service.createRegistroAcessoFormGroup(sampleWithRequiredData);

        const registroAcesso = service.getRegistroAcesso(formGroup) as any;

        expect(registroAcesso).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IRegistroAcesso should not enable id FormControl', () => {
        const formGroup = service.createRegistroAcessoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewRegistroAcesso should disable id FormControl', () => {
        const formGroup = service.createRegistroAcessoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
