import { IEstabelecimento, NewEstabelecimento } from './estabelecimento.model';

export const sampleWithRequiredData: IEstabelecimento = {
  id: '6d24ffe2-d8a8-44d2-8ea3-6580f2a772fd',
  descricao: 'excitable handle',
};

export const sampleWithPartialData: IEstabelecimento = {
  id: 'ac4334b8-a40e-47b7-9dc4-7ac70777c3ce',
  descricao: 'against now',
};

export const sampleWithFullData: IEstabelecimento = {
  id: '71d0f0ef-7a29-4752-979e-1eea514d4c16',
  descricao: 'granny properly atop',
};

export const sampleWithNewData: NewEstabelecimento = {
  descricao: 'hunger standard venom',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
