import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../telefone.test-samples';

import { TelefoneFormService } from './telefone-form.service';

describe('Telefone Form Service', () => {
  let service: TelefoneFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TelefoneFormService);
  });

  describe('Service methods', () => {
    describe('createTelefoneFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTelefoneFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tipoTelefone: expect.any(Object),
            numero: expect.any(Object),
            pessoa: expect.any(Object),
          }),
        );
      });

      it('passing ITelefone should create a new form with FormGroup', () => {
        const formGroup = service.createTelefoneFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            tipoTelefone: expect.any(Object),
            numero: expect.any(Object),
            pessoa: expect.any(Object),
          }),
        );
      });
    });

    describe('getTelefone', () => {
      it('should return NewTelefone for default Telefone initial value', () => {
        const formGroup = service.createTelefoneFormGroup(sampleWithNewData);

        const telefone = service.getTelefone(formGroup) as any;

        expect(telefone).toMatchObject(sampleWithNewData);
      });

      it('should return NewTelefone for empty Telefone initial value', () => {
        const formGroup = service.createTelefoneFormGroup();

        const telefone = service.getTelefone(formGroup) as any;

        expect(telefone).toMatchObject({});
      });

      it('should return ITelefone', () => {
        const formGroup = service.createTelefoneFormGroup(sampleWithRequiredData);

        const telefone = service.getTelefone(formGroup) as any;

        expect(telefone).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITelefone should not enable id FormControl', () => {
        const formGroup = service.createTelefoneFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTelefone should disable id FormControl', () => {
        const formGroup = service.createTelefoneFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
