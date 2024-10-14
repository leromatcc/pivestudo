import { ICamera, NewCamera } from './camera.model';

export const sampleWithRequiredData: ICamera = {
  id: 12779,
  descricao: 'when ash',
  enderecoRede: 'though',
};

export const sampleWithPartialData: ICamera = {
  id: 1159,
  descricao: 'satin mean',
  enderecoRede: 'whether',
};

export const sampleWithFullData: ICamera = {
  id: 11532,
  descricao: 'qua thoroughly for',
  enderecoRede: 'afterwards certainly',
  api: 'including conciliate',
};

export const sampleWithNewData: NewCamera = {
  descricao: 'positively qua viciously',
  enderecoRede: 'weaponize beneath',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
