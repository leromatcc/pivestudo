import { ITipoPessoa, NewTipoPessoa } from './tipo-pessoa.model';

export const sampleWithRequiredData: ITipoPessoa = {
  id: 14331,
  descricao: 'psst',
};

export const sampleWithPartialData: ITipoPessoa = {
  id: 26813,
  descricao: 'food usually spiffy',
  grupo: 'FUNCIONARIO',
};

export const sampleWithFullData: ITipoPessoa = {
  id: 24345,
  descricao: 'nominate cautiously',
  grupo: 'MORADOR',
};

export const sampleWithNewData: NewTipoPessoa = {
  descricao: 'ick yahoo',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
