import { IAutomovel, NewAutomovel } from './automovel.model';

export const sampleWithRequiredData: IAutomovel = {
  id: '30547c05-6fa8-4d5b-8c20-ff80183e63d0',
  placa: 'bitterly while',
};

export const sampleWithPartialData: IAutomovel = {
  id: '66089df3-ff87-42f3-821a-b3dc0a7e093a',
  placa: 'energetically preregister',
};

export const sampleWithFullData: IAutomovel = {
  id: '917c241f-119c-4735-b42e-15365c08669b',
  placa: 'onto',
  descricao: 'clearly',
};

export const sampleWithNewData: NewAutomovel = {
  placa: 'sandbar bind however',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
