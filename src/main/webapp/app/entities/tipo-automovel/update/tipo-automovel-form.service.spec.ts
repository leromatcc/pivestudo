import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../tipo-automovel.test-samples';

import { TipoAutomovelFormService } from './tipo-automovel-form.service';

describe('TipoAutomovel Form Service', () => {
  let service: TipoAutomovelFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoAutomovelFormService);
  });

  describe('Service methods', () => {
    describe('createTipoAutomovelFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createTipoAutomovelFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
            grupo: expect.any(Object),
          }),
        );
      });

      it('passing ITipoAutomovel should create a new form with FormGroup', () => {
        const formGroup = service.createTipoAutomovelFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
            grupo: expect.any(Object),
          }),
        );
      });
    });

    describe('getTipoAutomovel', () => {
      it('should return NewTipoAutomovel for default TipoAutomovel initial value', () => {
        const formGroup = service.createTipoAutomovelFormGroup(sampleWithNewData);

        const tipoAutomovel = service.getTipoAutomovel(formGroup) as any;

        expect(tipoAutomovel).toMatchObject(sampleWithNewData);
      });

      it('should return NewTipoAutomovel for empty TipoAutomovel initial value', () => {
        const formGroup = service.createTipoAutomovelFormGroup();

        const tipoAutomovel = service.getTipoAutomovel(formGroup) as any;

        expect(tipoAutomovel).toMatchObject({});
      });

      it('should return ITipoAutomovel', () => {
        const formGroup = service.createTipoAutomovelFormGroup(sampleWithRequiredData);

        const tipoAutomovel = service.getTipoAutomovel(formGroup) as any;

        expect(tipoAutomovel).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITipoAutomovel should not enable id FormControl', () => {
        const formGroup = service.createTipoAutomovelFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTipoAutomovel should disable id FormControl', () => {
        const formGroup = service.createTipoAutomovelFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
