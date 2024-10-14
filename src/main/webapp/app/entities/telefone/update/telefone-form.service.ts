import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ITelefone, NewTelefone } from '../telefone.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITelefone for edit and NewTelefoneFormGroupInput for create.
 */
type TelefoneFormGroupInput = ITelefone | PartialWithRequiredKeyOf<NewTelefone>;

type TelefoneFormDefaults = Pick<NewTelefone, 'id'>;

type TelefoneFormGroupContent = {
  id: FormControl<ITelefone['id'] | NewTelefone['id']>;
  tipoTelefone: FormControl<ITelefone['tipoTelefone']>;
  numero: FormControl<ITelefone['numero']>;
  pessoa: FormControl<ITelefone['pessoa']>;
};

export type TelefoneFormGroup = FormGroup<TelefoneFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TelefoneFormService {
  createTelefoneFormGroup(telefone: TelefoneFormGroupInput = { id: null }): TelefoneFormGroup {
    const telefoneRawValue = {
      ...this.getFormDefaults(),
      ...telefone,
    };
    return new FormGroup<TelefoneFormGroupContent>({
      id: new FormControl(
        { value: telefoneRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      tipoTelefone: new FormControl(telefoneRawValue.tipoTelefone),
      numero: new FormControl(telefoneRawValue.numero, {
        validators: [Validators.required],
      }),
      pessoa: new FormControl(telefoneRawValue.pessoa, {
        validators: [Validators.required],
      }),
    });
  }

  getTelefone(form: TelefoneFormGroup): ITelefone | NewTelefone {
    return form.getRawValue() as ITelefone | NewTelefone;
  }

  resetForm(form: TelefoneFormGroup, telefone: TelefoneFormGroupInput): void {
    const telefoneRawValue = { ...this.getFormDefaults(), ...telefone };
    form.reset(
      {
        ...telefoneRawValue,
        id: { value: telefoneRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): TelefoneFormDefaults {
    return {
      id: null,
    };
  }
}
