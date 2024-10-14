import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../camera.test-samples';

import { CameraFormService } from './camera-form.service';

describe('Camera Form Service', () => {
  let service: CameraFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraFormService);
  });

  describe('Service methods', () => {
    describe('createCameraFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCameraFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
            enderecoRede: expect.any(Object),
            api: expect.any(Object),
            pontoAcesso: expect.any(Object),
          }),
        );
      });

      it('passing ICamera should create a new form with FormGroup', () => {
        const formGroup = service.createCameraFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            descricao: expect.any(Object),
            enderecoRede: expect.any(Object),
            api: expect.any(Object),
            pontoAcesso: expect.any(Object),
          }),
        );
      });
    });

    describe('getCamera', () => {
      it('should return NewCamera for default Camera initial value', () => {
        const formGroup = service.createCameraFormGroup(sampleWithNewData);

        const camera = service.getCamera(formGroup) as any;

        expect(camera).toMatchObject(sampleWithNewData);
      });

      it('should return NewCamera for empty Camera initial value', () => {
        const formGroup = service.createCameraFormGroup();

        const camera = service.getCamera(formGroup) as any;

        expect(camera).toMatchObject({});
      });

      it('should return ICamera', () => {
        const formGroup = service.createCameraFormGroup(sampleWithRequiredData);

        const camera = service.getCamera(formGroup) as any;

        expect(camera).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICamera should not enable id FormControl', () => {
        const formGroup = service.createCameraFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCamera should disable id FormControl', () => {
        const formGroup = service.createCameraFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
