import { IPessoa, NewPessoa } from './pessoa.model';

export const sampleWithRequiredData: IPessoa = {
  id: '3e53fe2e-2cd3-417e-80cb-d19c9d3ce3ec',
  nome: 'sans',
};

export const sampleWithPartialData: IPessoa = {
  id: 'c78df373-615f-4059-8387-189f944d0c32',
  nome: 'ahX',
};

export const sampleWithFullData: IPessoa = {
  id: 'a4c52bf9-713c-471f-a52b-9f522edc8fe0',
  nome: 'keenly naturally lest',
};

export const sampleWithNewData: NewPessoa = {
  nome: 'out floodlight bad',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
