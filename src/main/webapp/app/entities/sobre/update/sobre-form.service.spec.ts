import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../sobre.test-samples';

import { SobreFormService } from './sobre-form.service';

describe('Sobre Form Service', () => {
  let service: SobreFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SobreFormService);
  });

  describe('Service methods', () => {
    describe('createSobreFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSobreFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
          }),
        );
      });

      it('passing ISobre should create a new form with FormGroup', () => {
        const formGroup = service.createSobreFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
          }),
        );
      });
    });

    describe('getSobre', () => {
      it('should return NewSobre for default Sobre initial value', () => {
        const formGroup = service.createSobreFormGroup(sampleWithNewData);

        const sobre = service.getSobre(formGroup) as any;

        expect(sobre).toMatchObject(sampleWithNewData);
      });

      it('should return NewSobre for empty Sobre initial value', () => {
        const formGroup = service.createSobreFormGroup();

        const sobre = service.getSobre(formGroup) as any;

        expect(sobre).toMatchObject({});
      });

      it('should return ISobre', () => {
        const formGroup = service.createSobreFormGroup(sampleWithRequiredData);

        const sobre = service.getSobre(formGroup) as any;

        expect(sobre).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISobre should not enable id FormControl', () => {
        const formGroup = service.createSobreFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSobre should disable id FormControl', () => {
        const formGroup = service.createSobreFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
