import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IPontoAcesso, NewPontoAcesso } from '../ponto-acesso.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPontoAcesso for edit and NewPontoAcessoFormGroupInput for create.
 */
type PontoAcessoFormGroupInput = IPontoAcesso | PartialWithRequiredKeyOf<NewPontoAcesso>;

type PontoAcessoFormDefaults = Pick<NewPontoAcesso, 'id'>;

type PontoAcessoFormGroupContent = {
  id: FormControl<IPontoAcesso['id'] | NewPontoAcesso['id']>;
  descricao: FormControl<IPontoAcesso['descricao']>;
  estabelecimento: FormControl<IPontoAcesso['estabelecimento']>;
};

export type PontoAcessoFormGroup = FormGroup<PontoAcessoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PontoAcessoFormService {
  createPontoAcessoFormGroup(pontoAcesso: PontoAcessoFormGroupInput = { id: null }): PontoAcessoFormGroup {
    const pontoAcessoRawValue = {
      ...this.getFormDefaults(),
      ...pontoAcesso,
    };
    return new FormGroup<PontoAcessoFormGroupContent>({
      id: new FormControl(
        { value: pontoAcessoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      descricao: new FormControl(pontoAcessoRawValue.descricao, {
        validators: [Validators.required],
      }),
      estabelecimento: new FormControl(pontoAcessoRawValue.estabelecimento, {
        validators: [Validators.required],
      }),
    });
  }

  getPontoAcesso(form: PontoAcessoFormGroup): IPontoAcesso | NewPontoAcesso {
    return form.getRawValue() as IPontoAcesso | NewPontoAcesso;
  }

  resetForm(form: PontoAcessoFormGroup, pontoAcesso: PontoAcessoFormGroupInput): void {
    const pontoAcessoRawValue = { ...this.getFormDefaults(), ...pontoAcesso };
    form.reset(
      {
        ...pontoAcessoRawValue,
        id: { value: pontoAcessoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PontoAcessoFormDefaults {
    return {
      id: null,
    };
  }
}
