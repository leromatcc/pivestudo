import { ICamera, NewCamera } from './camera.model';

export const sampleWithRequiredData: ICamera = {
  id: 7549,
  descricao: 'who',
  enderecoRede: 'gurn',
};

export const sampleWithPartialData: ICamera = {
  id: 18872,
  descricao: 'preside',
  enderecoRede: 'enthusiastically irritably intrepid',
};

export const sampleWithFullData: ICamera = {
  id: 5379,
  descricao: 'psst within',
  enderecoRede: 'if',
  api: 'leading acquire',
};

export const sampleWithNewData: NewCamera = {
  descricao: 'tenderly always access',
  enderecoRede: 'daily tabletop sup',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
