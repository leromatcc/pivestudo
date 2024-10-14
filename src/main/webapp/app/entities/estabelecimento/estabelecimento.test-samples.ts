import { IEstabelecimento, NewEstabelecimento } from './estabelecimento.model';

export const sampleWithRequiredData: IEstabelecimento = {
  id: '2ebdae57-a88d-4df2-87be-05d1b7d905a9',
  descricao: 'anesthetize',
};

export const sampleWithPartialData: IEstabelecimento = {
  id: '2eed05d9-4f25-4edc-82bd-215f4b65a39b',
  descricao: 'until',
};

export const sampleWithFullData: IEstabelecimento = {
  id: 'd9c08b5c-cf79-43a1-8a6d-dd214dfcfeee',
  descricao: 'necessary',
};

export const sampleWithNewData: NewEstabelecimento = {
  descricao: 'unto approve wink',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
