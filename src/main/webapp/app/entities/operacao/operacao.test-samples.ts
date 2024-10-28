import { IOperacao, NewOperacao } from './operacao.model';

export const sampleWithRequiredData: IOperacao = {
  id: 7893,
  arquivoImagem: '../fake-data/blob/hipster.png',
  arquivoImagemContentType: 'unknown',
};

export const sampleWithPartialData: IOperacao = {
  id: 8523,
  arquivoImagem: '../fake-data/blob/hipster.png',
  arquivoImagemContentType: 'unknown',
};

export const sampleWithFullData: IOperacao = {
  id: 3358,
  arquivoImagem: '../fake-data/blob/hipster.png',
  arquivoImagemContentType: 'unknown',
};

export const sampleWithNewData: NewOperacao = {
  arquivoImagem: '../fake-data/blob/hipster.png',
  arquivoImagemContentType: 'unknown',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
