import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../imagem.test-samples';

import { ImagemFormService } from './imagem-form.service';

describe('Imagem Form Service', () => {
  let service: ImagemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImagemFormService);
  });

  describe('Service methods', () => {
    describe('createImagemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createImagemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            arquivoImagem: expect.any(Object),
            nome: expect.any(Object),
            caminho: expect.any(Object),
            descricao: expect.any(Object),
            cadeiaDetectada: expect.any(Object),
            dateAnalise: expect.any(Object),
            registroAcesso: expect.any(Object),
          }),
        );
      });

      it('passing IImagem should create a new form with FormGroup', () => {
        const formGroup = service.createImagemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            arquivoImagem: expect.any(Object),
            nome: expect.any(Object),
            caminho: expect.any(Object),
            descricao: expect.any(Object),
            cadeiaDetectada: expect.any(Object),
            dateAnalise: expect.any(Object),
            registroAcesso: expect.any(Object),
          }),
        );
      });
    });

    describe('getImagem', () => {
      it('should return NewImagem for default Imagem initial value', () => {
        const formGroup = service.createImagemFormGroup(sampleWithNewData);

        const imagem = service.getImagem(formGroup) as any;

        expect(imagem).toMatchObject(sampleWithNewData);
      });

      it('should return NewImagem for empty Imagem initial value', () => {
        const formGroup = service.createImagemFormGroup();

        const imagem = service.getImagem(formGroup) as any;

        expect(imagem).toMatchObject({});
      });

      it('should return IImagem', () => {
        const formGroup = service.createImagemFormGroup(sampleWithRequiredData);

        const imagem = service.getImagem(formGroup) as any;

        expect(imagem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IImagem should not enable id FormControl', () => {
        const formGroup = service.createImagemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewImagem should disable id FormControl', () => {
        const formGroup = service.createImagemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
