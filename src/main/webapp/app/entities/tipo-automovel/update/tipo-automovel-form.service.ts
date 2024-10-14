import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITipoAutomovel, NewTipoAutomovel } from '../tipo-automovel.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITipoAutomovel for edit and NewTipoAutomovelFormGroupInput for create.
 */
type TipoAutomovelFormGroupInput = ITipoAutomovel | PartialWithRequiredKeyOf<NewTipoAutomovel>;

type TipoAutomovelFormDefaults = Pick<NewTipoAutomovel, 'id'>;

type TipoAutomovelFormGroupContent = {
  id: FormControl<ITipoAutomovel['id'] | NewTipoAutomovel['id']>;
  descricao: FormControl<ITipoAutomovel['descricao']>;
  grupo: FormControl<ITipoAutomovel['grupo']>;
};

export type TipoAutomovelFormGroup = FormGroup<TipoAutomovelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TipoAutomovelFormService {
  createTipoAutomovelFormGroup(tipoAutomovel: TipoAutomovelFormGroupInput = { id: null }): TipoAutomovelFormGroup {
    const tipoAutomovelRawValue = {
      ...this.getFormDefaults(),
      ...tipoAutomovel,
    };
    return new FormGroup<TipoAutomovelFormGroupContent>({
      id: new FormControl(
        { value: tipoAutomovelRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      descricao: new FormControl(tipoAutomovelRawValue.descricao, {
        validators: [Validators.required],
      }),
      grupo: new FormControl(tipoAutomovelRawValue.grupo, {
        validators: [Validators.required],
      }),
    });
  }

  getTipoAutomovel(form: TipoAutomovelFormGroup): ITipoAutomovel | NewTipoAutomovel {
    return form.getRawValue() as ITipoAutomovel | NewTipoAutomovel;
  }

  resetForm(form: TipoAutomovelFormGroup, tipoAutomovel: TipoAutomovelFormGroupInput): void {
    const tipoAutomovelRawValue = { ...this.getFormDefaults(), ...tipoAutomovel };
    form.reset(
      {
        ...tipoAutomovelRawValue,
        id: { value: tipoAutomovelRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TipoAutomovelFormDefaults {
    return {
      id: null,
    };
  }
}
