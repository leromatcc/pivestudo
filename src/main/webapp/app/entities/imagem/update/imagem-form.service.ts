import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IImagem, NewImagem } from '../imagem.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IImagem for edit and NewImagemFormGroupInput for create.
 */
type ImagemFormGroupInput = IImagem | PartialWithRequiredKeyOf<NewImagem>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IImagem | NewImagem> = Omit<T, 'dateAnalise'> & {
  dateAnalise?: string | null;
};

type ImagemFormRawValue = FormValueOf<IImagem>;

type NewImagemFormRawValue = FormValueOf<NewImagem>;

type ImagemFormDefaults = Pick<NewImagem, 'id' | 'dateAnalise'>;

type ImagemFormGroupContent = {
  id: FormControl<ImagemFormRawValue['id'] | NewImagem['id']>;
  arquivoImagem: FormControl<ImagemFormRawValue['arquivoImagem']>;
  arquivoImagemContentType: FormControl<ImagemFormRawValue['arquivoImagemContentType']>;
  nome: FormControl<ImagemFormRawValue['nome']>;
  caminho: FormControl<ImagemFormRawValue['caminho']>;
  descricao: FormControl<ImagemFormRawValue['descricao']>;
  cadeiaDetectada: FormControl<ImagemFormRawValue['cadeiaDetectada']>;
  dateAnalise: FormControl<ImagemFormRawValue['dateAnalise']>;
  registroAcesso: FormControl<ImagemFormRawValue['registroAcesso']>;
};

export type ImagemFormGroup = FormGroup<ImagemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ImagemFormService {
  createImagemFormGroup(imagem: ImagemFormGroupInput = { id: null }): ImagemFormGroup {
    const imagemRawValue = this.convertImagemToImagemRawValue({
      ...this.getFormDefaults(),
      ...imagem,
    });
    return new FormGroup<ImagemFormGroupContent>({
      id: new FormControl(
        { value: imagemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      arquivoImagem: new FormControl(imagemRawValue.arquivoImagem, {
        validators: [Validators.required],
      }),
      arquivoImagemContentType: new FormControl(imagemRawValue.arquivoImagemContentType),
      nome: new FormControl(imagemRawValue.nome, {
        validators: [Validators.required],
      }),
      caminho: new FormControl(imagemRawValue.caminho, {
        validators: [Validators.required],
      }),
      descricao: new FormControl(imagemRawValue.descricao),
      cadeiaDetectada: new FormControl(imagemRawValue.cadeiaDetectada),
      dateAnalise: new FormControl(imagemRawValue.dateAnalise),
      registroAcesso: new FormControl(imagemRawValue.registroAcesso, {
        validators: [Validators.required],
      }),
    });
  }

  getImagem(form: ImagemFormGroup): IImagem | NewImagem {
    return this.convertImagemRawValueToImagem(form.getRawValue() as ImagemFormRawValue | NewImagemFormRawValue);
  }

  resetForm(form: ImagemFormGroup, imagem: ImagemFormGroupInput): void {
    const imagemRawValue = this.convertImagemToImagemRawValue({ ...this.getFormDefaults(), ...imagem });
    form.reset(
      {
        ...imagemRawValue,
        id: { value: imagemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ImagemFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      dateAnalise: currentTime,
    };
  }

  private convertImagemRawValueToImagem(rawImagem: ImagemFormRawValue | NewImagemFormRawValue): IImagem | NewImagem {
    return {
      ...rawImagem,
      dateAnalise: dayjs(rawImagem.dateAnalise, DATE_TIME_FORMAT),
    };
  }

  private convertImagemToImagemRawValue(
    imagem: IImagem | (Partial<NewImagem> & ImagemFormDefaults),
  ): ImagemFormRawValue | PartialWithRequiredKeyOf<NewImagemFormRawValue> {
    return {
      ...imagem,
      dateAnalise: imagem.dateAnalise ? imagem.dateAnalise.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
