import { ITipoPessoa, NewTipoPessoa } from './tipo-pessoa.model';

export const sampleWithRequiredData: ITipoPessoa = {
  id: 2389,
  descricao: 'community pale',
};

export const sampleWithPartialData: ITipoPessoa = {
  id: 23883,
  descricao: 'before official stealthily',
  grupo: 'FUNCIONARIO',
};

export const sampleWithFullData: ITipoPessoa = {
  id: 18912,
  descricao: 'heavily off',
  grupo: 'FUNCIONARIO',
};

export const sampleWithNewData: NewTipoPessoa = {
  descricao: 'experienced',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
