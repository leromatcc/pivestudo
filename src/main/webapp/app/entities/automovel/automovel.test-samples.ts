import { IAutomovel, NewAutomovel } from './automovel.model';

export const sampleWithRequiredData: IAutomovel = {
  id: '7358941d-7a36-4095-a041-74cc015e6df9',
  placa: 'until particularize acclaimed',
};

export const sampleWithPartialData: IAutomovel = {
  id: '1a8039ef-633b-4d50-881a-72a5c0e9a8c2',
  placa: 'frankly clearly instead',
};

export const sampleWithFullData: IAutomovel = {
  id: 'a088f99d-1f93-4bf0-8f88-77a2af735211',
  placa: 'boohoo meanwhile',
  descricao: 'corner',
};

export const sampleWithNewData: NewAutomovel = {
  placa: 'because immaculate',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
