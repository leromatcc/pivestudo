import { ITelefone, NewTelefone } from './telefone.model';

export const sampleWithRequiredData: ITelefone = {
  id: '8165b0a0-0187-4cbb-a900-134d233c7671',
  numero: 'unwelcome despite especially',
};

export const sampleWithPartialData: ITelefone = {
  id: 'f6c1bf44-99bd-4020-ab3f-8371734ad9bf',
  tipoTelefone: 'barring waft as',
  numero: 'carp onto hmph',
};

export const sampleWithFullData: ITelefone = {
  id: '3fc356c8-6f1a-46a3-95e8-f755070dfcbd',
  tipoTelefone: 'careless',
  numero: 'but',
};

export const sampleWithNewData: NewTelefone = {
  numero: 'tomorrow at',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
