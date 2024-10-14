import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IDocumento, NewDocumento } from '../documento.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDocumento for edit and NewDocumentoFormGroupInput for create.
 */
type DocumentoFormGroupInput = IDocumento | PartialWithRequiredKeyOf<NewDocumento>;

type DocumentoFormDefaults = Pick<NewDocumento, 'id'>;

type DocumentoFormGroupContent = {
  id: FormControl<IDocumento['id'] | NewDocumento['id']>;
  tipoDocumento: FormControl<IDocumento['tipoDocumento']>;
  numeroDocumento: FormControl<IDocumento['numeroDocumento']>;
  descricao: FormControl<IDocumento['descricao']>;
  pessoa: FormControl<IDocumento['pessoa']>;
};

export type DocumentoFormGroup = FormGroup<DocumentoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DocumentoFormService {
  createDocumentoFormGroup(documento: DocumentoFormGroupInput = { id: null }): DocumentoFormGroup {
    const documentoRawValue = {
      ...this.getFormDefaults(),
      ...documento,
    };
    return new FormGroup<DocumentoFormGroupContent>({
      id: new FormControl(
        { value: documentoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      tipoDocumento: new FormControl(documentoRawValue.tipoDocumento),
      numeroDocumento: new FormControl(documentoRawValue.numeroDocumento, {
        validators: [Validators.required],
      }),
      descricao: new FormControl(documentoRawValue.descricao),
      pessoa: new FormControl(documentoRawValue.pessoa, {
        validators: [Validators.required],
      }),
    });
  }

  getDocumento(form: DocumentoFormGroup): IDocumento | NewDocumento {
    return form.getRawValue() as IDocumento | NewDocumento;
  }

  resetForm(form: DocumentoFormGroup, documento: DocumentoFormGroupInput): void {
    const documentoRawValue = { ...this.getFormDefaults(), ...documento };
    form.reset(
      {
        ...documentoRawValue,
        id: { value: documentoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): DocumentoFormDefaults {
    return {
      id: null,
    };
  }
}
