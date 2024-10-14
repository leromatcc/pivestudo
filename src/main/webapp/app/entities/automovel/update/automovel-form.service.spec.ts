import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../automovel.test-samples';

import { AutomovelFormService } from './automovel-form.service';

describe('Automovel Form Service', () => {
  let service: AutomovelFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutomovelFormService);
  });

  describe('Service methods', () => {
    describe('createAutomovelFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAutomovelFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            placa: expect.any(Object),
            descricao: expect.any(Object),
            tipoAutomovel: expect.any(Object),
            pessoa: expect.any(Object),
          }),
        );
      });

      it('passing IAutomovel should create a new form with FormGroup', () => {
        const formGroup = service.createAutomovelFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            placa: expect.any(Object),
            descricao: expect.any(Object),
            tipoAutomovel: expect.any(Object),
            pessoa: expect.any(Object),
          }),
        );
      });
    });

    describe('getAutomovel', () => {
      it('should return NewAutomovel for default Automovel initial value', () => {
        const formGroup = service.createAutomovelFormGroup(sampleWithNewData);

        const automovel = service.getAutomovel(formGroup) as any;

        expect(automovel).toMatchObject(sampleWithNewData);
      });

      it('should return NewAutomovel for empty Automovel initial value', () => {
        const formGroup = service.createAutomovelFormGroup();

        const automovel = service.getAutomovel(formGroup) as any;

        expect(automovel).toMatchObject({});
      });

      it('should return IAutomovel', () => {
        const formGroup = service.createAutomovelFormGroup(sampleWithRequiredData);

        const automovel = service.getAutomovel(formGroup) as any;

        expect(automovel).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IAutomovel should not enable id FormControl', () => {
        const formGroup = service.createAutomovelFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewAutomovel should disable id FormControl', () => {
        const formGroup = service.createAutomovelFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
