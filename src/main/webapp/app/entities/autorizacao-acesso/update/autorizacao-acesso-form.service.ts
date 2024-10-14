import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAutorizacaoAcesso, NewAutorizacaoAcesso } from '../autorizacao-acesso.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAutorizacaoAcesso for edit and NewAutorizacaoAcessoFormGroupInput for create.
 */
type AutorizacaoAcessoFormGroupInput = IAutorizacaoAcesso | PartialWithRequiredKeyOf<NewAutorizacaoAcesso>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IAutorizacaoAcesso | NewAutorizacaoAcesso> = Omit<T, 'dataInicial' | 'dataFinal'> & {
  dataInicial?: string | null;
  dataFinal?: string | null;
};

type AutorizacaoAcessoFormRawValue = FormValueOf<IAutorizacaoAcesso>;

type NewAutorizacaoAcessoFormRawValue = FormValueOf<NewAutorizacaoAcesso>;

type AutorizacaoAcessoFormDefaults = Pick<NewAutorizacaoAcesso, 'id' | 'dataInicial' | 'dataFinal'>;

type AutorizacaoAcessoFormGroupContent = {
  id: FormControl<AutorizacaoAcessoFormRawValue['id'] | NewAutorizacaoAcesso['id']>;
  descricao: FormControl<AutorizacaoAcessoFormRawValue['descricao']>;
  dataInicial: FormControl<AutorizacaoAcessoFormRawValue['dataInicial']>;
  dataFinal: FormControl<AutorizacaoAcessoFormRawValue['dataFinal']>;
  status: FormControl<AutorizacaoAcessoFormRawValue['status']>;
  pessoa: FormControl<AutorizacaoAcessoFormRawValue['pessoa']>;
  estabelecimento: FormControl<AutorizacaoAcessoFormRawValue['estabelecimento']>;
};

export type AutorizacaoAcessoFormGroup = FormGroup<AutorizacaoAcessoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AutorizacaoAcessoFormService {
  createAutorizacaoAcessoFormGroup(autorizacaoAcesso: AutorizacaoAcessoFormGroupInput = { id: null }): AutorizacaoAcessoFormGroup {
    const autorizacaoAcessoRawValue = this.convertAutorizacaoAcessoToAutorizacaoAcessoRawValue({
      ...this.getFormDefaults(),
      ...autorizacaoAcesso,
    });
    return new FormGroup<AutorizacaoAcessoFormGroupContent>({
      id: new FormControl(
        { value: autorizacaoAcessoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      descricao: new FormControl(autorizacaoAcessoRawValue.descricao, {
        validators: [Validators.required],
      }),
      dataInicial: new FormControl(autorizacaoAcessoRawValue.dataInicial, {
        validators: [Validators.required],
      }),
      dataFinal: new FormControl(autorizacaoAcessoRawValue.dataFinal, {
        validators: [Validators.required],
      }),
      status: new FormControl(autorizacaoAcessoRawValue.status, {
        validators: [Validators.required],
      }),
      pessoa: new FormControl(autorizacaoAcessoRawValue.pessoa, {
        validators: [Validators.required],
      }),
      estabelecimento: new FormControl(autorizacaoAcessoRawValue.estabelecimento, {
        validators: [Validators.required],
      }),
    });
  }

  getAutorizacaoAcesso(form: AutorizacaoAcessoFormGroup): IAutorizacaoAcesso | NewAutorizacaoAcesso {
    return this.convertAutorizacaoAcessoRawValueToAutorizacaoAcesso(
      form.getRawValue() as AutorizacaoAcessoFormRawValue | NewAutorizacaoAcessoFormRawValue,
    );
  }

  resetForm(form: AutorizacaoAcessoFormGroup, autorizacaoAcesso: AutorizacaoAcessoFormGroupInput): void {
    const autorizacaoAcessoRawValue = this.convertAutorizacaoAcessoToAutorizacaoAcessoRawValue({
      ...this.getFormDefaults(),
      ...autorizacaoAcesso,
    });
    form.reset(
      {
        ...autorizacaoAcessoRawValue,
        id: { value: autorizacaoAcessoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): AutorizacaoAcessoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dataInicial: currentTime,
      dataFinal: currentTime,
    };
  }

  private convertAutorizacaoAcessoRawValueToAutorizacaoAcesso(
    rawAutorizacaoAcesso: AutorizacaoAcessoFormRawValue | NewAutorizacaoAcessoFormRawValue,
  ): IAutorizacaoAcesso | NewAutorizacaoAcesso {
    return {
      ...rawAutorizacaoAcesso,
      dataInicial: dayjs(rawAutorizacaoAcesso.dataInicial, DATE_TIME_FORMAT),
      dataFinal: dayjs(rawAutorizacaoAcesso.dataFinal, DATE_TIME_FORMAT),
    };
  }

  private convertAutorizacaoAcessoToAutorizacaoAcessoRawValue(
    autorizacaoAcesso: IAutorizacaoAcesso | (Partial<NewAutorizacaoAcesso> & AutorizacaoAcessoFormDefaults),
  ): AutorizacaoAcessoFormRawValue | PartialWithRequiredKeyOf<NewAutorizacaoAcessoFormRawValue> {
    return {
      ...autorizacaoAcesso,
      dataInicial: autorizacaoAcesso.dataInicial ? autorizacaoAcesso.dataInicial.format(DATE_TIME_FORMAT) : undefined,
      dataFinal: autorizacaoAcesso.dataFinal ? autorizacaoAcesso.dataFinal.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
