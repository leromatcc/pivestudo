import { ISobre, NewSobre } from './sobre.model';

export const sampleWithRequiredData: ISobre = {
  id: 31600,
};

export const sampleWithPartialData: ISobre = {
  id: 30633,
  descricao: 'fluffy',
};

export const sampleWithFullData: ISobre = {
  id: 9884,
  descricao: 'ordinary cute actually',
};

export const sampleWithNewData: NewSobre = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
