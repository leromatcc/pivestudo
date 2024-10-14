import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IRegistroAcesso, NewRegistroAcesso } from '../registro-acesso.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRegistroAcesso for edit and NewRegistroAcessoFormGroupInput for create.
 */
type RegistroAcessoFormGroupInput = IRegistroAcesso | PartialWithRequiredKeyOf<NewRegistroAcesso>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IRegistroAcesso | NewRegistroAcesso> = Omit<T, 'dataHora'> & {
  dataHora?: string | null;
};

type RegistroAcessoFormRawValue = FormValueOf<IRegistroAcesso>;

type NewRegistroAcessoFormRawValue = FormValueOf<NewRegistroAcesso>;

type RegistroAcessoFormDefaults = Pick<NewRegistroAcesso, 'id' | 'dataHora'>;

type RegistroAcessoFormGroupContent = {
  id: FormControl<RegistroAcessoFormRawValue['id'] | NewRegistroAcesso['id']>;
  dataHora: FormControl<RegistroAcessoFormRawValue['dataHora']>;
  cadeiaAnalisada: FormControl<RegistroAcessoFormRawValue['cadeiaAnalisada']>;
  acessoAutorizado: FormControl<RegistroAcessoFormRawValue['acessoAutorizado']>;
  pontoAcesso: FormControl<RegistroAcessoFormRawValue['pontoAcesso']>;
  automovel: FormControl<RegistroAcessoFormRawValue['automovel']>;
  autorizacaoAcesso: FormControl<RegistroAcessoFormRawValue['autorizacaoAcesso']>;
};

export type RegistroAcessoFormGroup = FormGroup<RegistroAcessoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RegistroAcessoFormService {
  createRegistroAcessoFormGroup(registroAcesso: RegistroAcessoFormGroupInput = { id: null }): RegistroAcessoFormGroup {
    const registroAcessoRawValue = this.convertRegistroAcessoToRegistroAcessoRawValue({
      ...this.getFormDefaults(),
      ...registroAcesso,
    });
    return new FormGroup<RegistroAcessoFormGroupContent>({
      id: new FormControl(
        { value: registroAcessoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      dataHora: new FormControl(registroAcessoRawValue.dataHora, {
        validators: [Validators.required],
      }),
      cadeiaAnalisada: new FormControl(registroAcessoRawValue.cadeiaAnalisada),
      acessoAutorizado: new FormControl(registroAcessoRawValue.acessoAutorizado, {
        validators: [Validators.required],
      }),
      pontoAcesso: new FormControl(registroAcessoRawValue.pontoAcesso, {
        validators: [Validators.required],
      }),
      automovel: new FormControl(registroAcessoRawValue.automovel, {
        validators: [Validators.required],
      }),
      autorizacaoAcesso: new FormControl(registroAcessoRawValue.autorizacaoAcesso, {
        validators: [Validators.required],
      }),
    });
  }

  getRegistroAcesso(form: RegistroAcessoFormGroup): IRegistroAcesso | NewRegistroAcesso {
    return this.convertRegistroAcessoRawValueToRegistroAcesso(
      form.getRawValue() as RegistroAcessoFormRawValue | NewRegistroAcessoFormRawValue,
    );
  }

  resetForm(form: RegistroAcessoFormGroup, registroAcesso: RegistroAcessoFormGroupInput): void {
    const registroAcessoRawValue = this.convertRegistroAcessoToRegistroAcessoRawValue({ ...this.getFormDefaults(), ...registroAcesso });
    form.reset(
      {
        ...registroAcessoRawValue,
        id: { value: registroAcessoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): RegistroAcessoFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dataHora: currentTime,
    };
  }

  private convertRegistroAcessoRawValueToRegistroAcesso(
    rawRegistroAcesso: RegistroAcessoFormRawValue | NewRegistroAcessoFormRawValue,
  ): IRegistroAcesso | NewRegistroAcesso {
    return {
      ...rawRegistroAcesso,
      dataHora: dayjs(rawRegistroAcesso.dataHora, DATE_TIME_FORMAT),
    };
  }

  private convertRegistroAcessoToRegistroAcessoRawValue(
    registroAcesso: IRegistroAcesso | (Partial<NewRegistroAcesso> & RegistroAcessoFormDefaults),
  ): RegistroAcessoFormRawValue | PartialWithRequiredKeyOf<NewRegistroAcessoFormRawValue> {
    return {
      ...registroAcesso,
      dataHora: registroAcesso.dataHora ? registroAcesso.dataHora.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
