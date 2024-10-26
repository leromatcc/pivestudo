import { ITipoAutomovel, NewTipoAutomovel } from './tipo-automovel.model';

export const sampleWithRequiredData: ITipoAutomovel = {
  id: '9f606f00-f6a7-4a07-8d0f-32cc609b3a75',
  descricao: 'gee',
  grupo: 'CAMINHAO',
};

export const sampleWithPartialData: ITipoAutomovel = {
  id: '8189a41b-e5c2-40b6-9bcd-f9e509b1fe11',
  descricao: 'extra-large remark naturally',
  grupo: 'OUTRO',
};

export const sampleWithFullData: ITipoAutomovel = {
  id: '759584a8-39bf-4b20-b377-6bb60d769109',
  descricao: 'certainly incidentally',
  grupo: 'MOTO',
};

export const sampleWithNewData: NewTipoAutomovel = {
  descricao: 'motivate apparatus westernize',
  grupo: 'CAMINHAO',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
