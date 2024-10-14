import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IAutomovel, NewAutomovel } from '../automovel.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAutomovel for edit and NewAutomovelFormGroupInput for create.
 */
type AutomovelFormGroupInput = IAutomovel | PartialWithRequiredKeyOf<NewAutomovel>;

type AutomovelFormDefaults = Pick<NewAutomovel, 'id'>;

type AutomovelFormGroupContent = {
  id: FormControl<IAutomovel['id'] | NewAutomovel['id']>;
  placa: FormControl<IAutomovel['placa']>;
  descricao: FormControl<IAutomovel['descricao']>;
  tipoAutomovel: FormControl<IAutomovel['tipoAutomovel']>;
  pessoa: FormControl<IAutomovel['pessoa']>;
};

export type AutomovelFormGroup = FormGroup<AutomovelFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AutomovelFormService {
  createAutomovelFormGroup(automovel: AutomovelFormGroupInput = { id: null }): AutomovelFormGroup {
    const automovelRawValue = {
      ...this.getFormDefaults(),
      ...automovel,
    };
    return new FormGroup<AutomovelFormGroupContent>({
      id: new FormControl(
        { value: automovelRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      placa: new FormControl(automovelRawValue.placa, {
        validators: [Validators.required],
      }),
      descricao: new FormControl(automovelRawValue.descricao),
      tipoAutomovel: new FormControl(automovelRawValue.tipoAutomovel, {
        validators: [Validators.required],
      }),
      pessoa: new FormControl(automovelRawValue.pessoa, {
        validators: [Validators.required],
      }),
    });
  }

  getAutomovel(form: AutomovelFormGroup): IAutomovel | NewAutomovel {
    return form.getRawValue() as IAutomovel | NewAutomovel;
  }

  resetForm(form: AutomovelFormGroup, automovel: AutomovelFormGroupInput): void {
    const automovelRawValue = { ...this.getFormDefaults(), ...automovel };
    form.reset(
      {
        ...automovelRawValue,
        id: { value: automovelRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AutomovelFormDefaults {
    return {
      id: null,
    };
  }
}
