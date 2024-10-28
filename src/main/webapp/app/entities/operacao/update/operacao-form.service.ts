import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IOperacao, NewOperacao } from '../operacao.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IOperacao for edit and NewOperacaoFormGroupInput for create.
 */
type OperacaoFormGroupInput = IOperacao | PartialWithRequiredKeyOf<NewOperacao>;

type OperacaoFormDefaults = Pick<NewOperacao, 'id'>;

type OperacaoFormGroupContent = {
  id: FormControl<IOperacao['id'] | NewOperacao['id']>;
  arquivoImagem: FormControl<IOperacao['arquivoImagem']>;
  arquivoImagemContentType: FormControl<IOperacao['arquivoImagemContentType']>;
};

export type OperacaoFormGroup = FormGroup<OperacaoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class OperacaoFormService {
  createOperacaoFormGroup(operacao: OperacaoFormGroupInput = { id: null }): OperacaoFormGroup {
    const operacaoRawValue = {
      ...this.getFormDefaults(),
      ...operacao,
    };
    return new FormGroup<OperacaoFormGroupContent>({
      id: new FormControl(
        { value: operacaoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      arquivoImagem: new FormControl(operacaoRawValue.arquivoImagem, {
        validators: [Validators.required],
      }),
      arquivoImagemContentType: new FormControl(operacaoRawValue.arquivoImagemContentType),
    });
  }

  getOperacao(form: OperacaoFormGroup): IOperacao | NewOperacao {
    return form.getRawValue() as IOperacao | NewOperacao;
  }

  resetForm(form: OperacaoFormGroup, operacao: OperacaoFormGroupInput): void {
    const operacaoRawValue = { ...this.getFormDefaults(), ...operacao };
    form.reset(
      {
        ...operacaoRawValue,
        id: { value: operacaoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): OperacaoFormDefaults {
    return {
      id: null,
    };
  }
}
