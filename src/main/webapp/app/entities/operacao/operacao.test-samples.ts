import { IOperacao, NewOperacao } from './operacao.model';

export const sampleWithRequiredData: IOperacao = {
  id: 7893,
};

export const sampleWithPartialData: IOperacao = {
  id: 3358,
  descricao: 'on anticodon',
};

export const sampleWithFullData: IOperacao = {
  id: 21499,
  descricao: 'buzzing',
};

export const sampleWithNewData: NewOperacao = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
