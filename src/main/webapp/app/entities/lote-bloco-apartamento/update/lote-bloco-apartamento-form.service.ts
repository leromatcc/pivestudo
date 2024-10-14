import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ILoteBlocoApartamento, NewLoteBlocoApartamento } from '../lote-bloco-apartamento.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILoteBlocoApartamento for edit and NewLoteBlocoApartamentoFormGroupInput for create.
 */
type LoteBlocoApartamentoFormGroupInput = ILoteBlocoApartamento | PartialWithRequiredKeyOf<NewLoteBlocoApartamento>;

type LoteBlocoApartamentoFormDefaults = Pick<NewLoteBlocoApartamento, 'id'>;

type LoteBlocoApartamentoFormGroupContent = {
  id: FormControl<ILoteBlocoApartamento['id'] | NewLoteBlocoApartamento['id']>;
  bloco: FormControl<ILoteBlocoApartamento['bloco']>;
  andar: FormControl<ILoteBlocoApartamento['andar']>;
  numero: FormControl<ILoteBlocoApartamento['numero']>;
  endereco: FormControl<ILoteBlocoApartamento['endereco']>;
  pessoa: FormControl<ILoteBlocoApartamento['pessoa']>;
};

export type LoteBlocoApartamentoFormGroup = FormGroup<LoteBlocoApartamentoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LoteBlocoApartamentoFormService {
  createLoteBlocoApartamentoFormGroup(
    loteBlocoApartamento: LoteBlocoApartamentoFormGroupInput = { id: null },
  ): LoteBlocoApartamentoFormGroup {
    const loteBlocoApartamentoRawValue = {
      ...this.getFormDefaults(),
      ...loteBlocoApartamento,
    };
    return new FormGroup<LoteBlocoApartamentoFormGroupContent>({
      id: new FormControl(
        { value: loteBlocoApartamentoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      bloco: new FormControl(loteBlocoApartamentoRawValue.bloco),
      andar: new FormControl(loteBlocoApartamentoRawValue.andar),
      numero: new FormControl(loteBlocoApartamentoRawValue.numero),
      endereco: new FormControl(loteBlocoApartamentoRawValue.endereco, {
        validators: [Validators.required],
      }),
      pessoa: new FormControl(loteBlocoApartamentoRawValue.pessoa, {
        validators: [Validators.required],
      }),
    });
  }

  getLoteBlocoApartamento(form: LoteBlocoApartamentoFormGroup): ILoteBlocoApartamento | NewLoteBlocoApartamento {
    return form.getRawValue() as ILoteBlocoApartamento | NewLoteBlocoApartamento;
  }

  resetForm(form: LoteBlocoApartamentoFormGroup, loteBlocoApartamento: LoteBlocoApartamentoFormGroupInput): void {
    const loteBlocoApartamentoRawValue = { ...this.getFormDefaults(), ...loteBlocoApartamento };
    form.reset(
      {
        ...loteBlocoApartamentoRawValue,
        id: { value: loteBlocoApartamentoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): LoteBlocoApartamentoFormDefaults {
    return {
      id: null,
    };
  }
}
