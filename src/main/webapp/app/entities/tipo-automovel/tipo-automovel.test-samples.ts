import { ITipoAutomovel, NewTipoAutomovel } from './tipo-automovel.model';

export const sampleWithRequiredData: ITipoAutomovel = {
  id: '55cdd2a6-3e7a-41a9-a0d7-0b6f7ab83af0',
  descricao: 'miniature',
  grupo: 'OUTRO',
};

export const sampleWithPartialData: ITipoAutomovel = {
  id: 'e0ca0435-5b1e-46d9-8b3e-cd7e66558a81',
  descricao: 'forenenst stint once',
  grupo: 'CAMINHAO',
};

export const sampleWithFullData: ITipoAutomovel = {
  id: '29ef06d0-c64f-490d-a03f-96aa875a4097',
  descricao: 'toddle glimmering eek',
  grupo: 'MOTO',
};

export const sampleWithNewData: NewTipoAutomovel = {
  descricao: 'adjudicate video',
  grupo: 'CAMINHAO',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
