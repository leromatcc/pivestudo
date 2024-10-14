import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IEndereco, NewEndereco } from '../endereco.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEndereco for edit and NewEnderecoFormGroupInput for create.
 */
type EnderecoFormGroupInput = IEndereco | PartialWithRequiredKeyOf<NewEndereco>;

type EnderecoFormDefaults = Pick<NewEndereco, 'id'>;

type EnderecoFormGroupContent = {
  id: FormControl<IEndereco['id'] | NewEndereco['id']>;
  descricao: FormControl<IEndereco['descricao']>;
  cep: FormControl<IEndereco['cep']>;
  logradouro: FormControl<IEndereco['logradouro']>;
  numero: FormControl<IEndereco['numero']>;
  complemento: FormControl<IEndereco['complemento']>;
  referencia: FormControl<IEndereco['referencia']>;
  cidade: FormControl<IEndereco['cidade']>;
  estado: FormControl<IEndereco['estado']>;
  pais: FormControl<IEndereco['pais']>;
  pessoa: FormControl<IEndereco['pessoa']>;
};

export type EnderecoFormGroup = FormGroup<EnderecoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EnderecoFormService {
  createEnderecoFormGroup(endereco: EnderecoFormGroupInput = { id: null }): EnderecoFormGroup {
    const enderecoRawValue = {
      ...this.getFormDefaults(),
      ...endereco,
    };
    return new FormGroup<EnderecoFormGroupContent>({
      id: new FormControl(
        { value: enderecoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      descricao: new FormControl(enderecoRawValue.descricao),
      cep: new FormControl(enderecoRawValue.cep),
      logradouro: new FormControl(enderecoRawValue.logradouro),
      numero: new FormControl(enderecoRawValue.numero),
      complemento: new FormControl(enderecoRawValue.complemento),
      referencia: new FormControl(enderecoRawValue.referencia),
      cidade: new FormControl(enderecoRawValue.cidade),
      estado: new FormControl(enderecoRawValue.estado),
      pais: new FormControl(enderecoRawValue.pais),
      pessoa: new FormControl(enderecoRawValue.pessoa),
    });
  }

  getEndereco(form: EnderecoFormGroup): IEndereco | NewEndereco {
    return form.getRawValue() as IEndereco | NewEndereco;
  }

  resetForm(form: EnderecoFormGroup, endereco: EnderecoFormGroupInput): void {
    const enderecoRawValue = { ...this.getFormDefaults(), ...endereco };
    form.reset(
      {
        ...enderecoRawValue,
        id: { value: enderecoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EnderecoFormDefaults {
    return {
      id: null,
    };
  }
}
