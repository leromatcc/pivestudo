import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IEstabelecimento, NewEstabelecimento } from '../estabelecimento.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEstabelecimento for edit and NewEstabelecimentoFormGroupInput for create.
 */
type EstabelecimentoFormGroupInput = IEstabelecimento | PartialWithRequiredKeyOf<NewEstabelecimento>;

type EstabelecimentoFormDefaults = Pick<NewEstabelecimento, 'id'>;

type EstabelecimentoFormGroupContent = {
  id: FormControl<IEstabelecimento['id'] | NewEstabelecimento['id']>;
  descricao: FormControl<IEstabelecimento['descricao']>;
  endereco: FormControl<IEstabelecimento['endereco']>;
};

export type EstabelecimentoFormGroup = FormGroup<EstabelecimentoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EstabelecimentoFormService {
  createEstabelecimentoFormGroup(estabelecimento: EstabelecimentoFormGroupInput = { id: null }): EstabelecimentoFormGroup {
    const estabelecimentoRawValue = {
      ...this.getFormDefaults(),
      ...estabelecimento,
    };
    return new FormGroup<EstabelecimentoFormGroupContent>({
      id: new FormControl(
        { value: estabelecimentoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      descricao: new FormControl(estabelecimentoRawValue.descricao, {
        validators: [Validators.required],
      }),
      endereco: new FormControl(estabelecimentoRawValue.endereco, {
        validators: [Validators.required],
      }),
    });
  }

  getEstabelecimento(form: EstabelecimentoFormGroup): IEstabelecimento | NewEstabelecimento {
    return form.getRawValue() as IEstabelecimento | NewEstabelecimento;
  }

  resetForm(form: EstabelecimentoFormGroup, estabelecimento: EstabelecimentoFormGroupInput): void {
    const estabelecimentoRawValue = { ...this.getFormDefaults(), ...estabelecimento };
    form.reset(
      {
        ...estabelecimentoRawValue,
        id: { value: estabelecimentoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EstabelecimentoFormDefaults {
    return {
      id: null,
    };
  }
}
