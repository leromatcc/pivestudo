import { IPontoAcesso, NewPontoAcesso } from './ponto-acesso.model';

export const sampleWithRequiredData: IPontoAcesso = {
  id: '5c0a10a4-98a8-4091-b80a-bfc38981dbb2',
  descricao: 'unto',
};

export const sampleWithPartialData: IPontoAcesso = {
  id: '693b1710-1fc2-4283-b540-c861c7d0d727',
  descricao: 'psst',
};

export const sampleWithFullData: IPontoAcesso = {
  id: '56cf57e0-afe6-4091-96a2-26871b7937de',
  descricao: 'if',
};

export const sampleWithNewData: NewPontoAcesso = {
  descricao: 'for',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
