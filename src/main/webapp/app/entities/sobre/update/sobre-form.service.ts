import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ISobre, NewSobre } from '../sobre.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISobre for edit and NewSobreFormGroupInput for create.
 */
type SobreFormGroupInput = ISobre | PartialWithRequiredKeyOf<NewSobre>;

type SobreFormDefaults = Pick<NewSobre, 'id'>;

type SobreFormGroupContent = {
  id: FormControl<ISobre['id'] | NewSobre['id']>;
  descricao: FormControl<ISobre['descricao']>;
};

export type SobreFormGroup = FormGroup<SobreFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SobreFormService {
  createSobreFormGroup(sobre: SobreFormGroupInput = { id: null }): SobreFormGroup {
    const sobreRawValue = {
      ...this.getFormDefaults(),
      ...sobre,
    };
    return new FormGroup<SobreFormGroupContent>({
      id: new FormControl(
        { value: sobreRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      descricao: new FormControl(sobreRawValue.descricao),
    });
  }

  getSobre(form: SobreFormGroup): ISobre | NewSobre {
    return form.getRawValue() as ISobre | NewSobre;
  }

  resetForm(form: SobreFormGroup, sobre: SobreFormGroupInput): void {
    const sobreRawValue = { ...this.getFormDefaults(), ...sobre };
    form.reset(
      {
        ...sobreRawValue,
        id: { value: sobreRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): SobreFormDefaults {
    return {
      id: null,
    };
  }
}
