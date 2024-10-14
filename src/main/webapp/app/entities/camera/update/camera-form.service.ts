import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ICamera, NewCamera } from '../camera.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICamera for edit and NewCameraFormGroupInput for create.
 */
type CameraFormGroupInput = ICamera | PartialWithRequiredKeyOf<NewCamera>;

type CameraFormDefaults = Pick<NewCamera, 'id'>;

type CameraFormGroupContent = {
  id: FormControl<ICamera['id'] | NewCamera['id']>;
  descricao: FormControl<ICamera['descricao']>;
  enderecoRede: FormControl<ICamera['enderecoRede']>;
  api: FormControl<ICamera['api']>;
  pontoAcesso: FormControl<ICamera['pontoAcesso']>;
};

export type CameraFormGroup = FormGroup<CameraFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CameraFormService {
  createCameraFormGroup(camera: CameraFormGroupInput = { id: null }): CameraFormGroup {
    const cameraRawValue = {
      ...this.getFormDefaults(),
      ...camera,
    };
    return new FormGroup<CameraFormGroupContent>({
      id: new FormControl(
        { value: cameraRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      descricao: new FormControl(cameraRawValue.descricao, {
        validators: [Validators.required],
      }),
      enderecoRede: new FormControl(cameraRawValue.enderecoRede, {
        validators: [Validators.required],
      }),
      api: new FormControl(cameraRawValue.api),
      pontoAcesso: new FormControl(cameraRawValue.pontoAcesso, {
        validators: [Validators.required],
      }),
    });
  }

  getCamera(form: CameraFormGroup): ICamera | NewCamera {
    return form.getRawValue() as ICamera | NewCamera;
  }

  resetForm(form: CameraFormGroup, camera: CameraFormGroupInput): void {
    const cameraRawValue = { ...this.getFormDefaults(), ...camera };
    form.reset(
      {
        ...cameraRawValue,
        id: { value: cameraRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CameraFormDefaults {
    return {
      id: null,
    };
  }
}
