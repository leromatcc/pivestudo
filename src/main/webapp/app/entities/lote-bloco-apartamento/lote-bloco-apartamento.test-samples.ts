import { ILoteBlocoApartamento, NewLoteBlocoApartamento } from './lote-bloco-apartamento.model';

export const sampleWithRequiredData: ILoteBlocoApartamento = {
  id: 'f6283dcc-b390-4198-8881-d275f268d506',
};

export const sampleWithPartialData: ILoteBlocoApartamento = {
  id: 'a1f5ea64-7777-4c78-ac0a-a5d37953f42e',
  bloco: 'everlasting where uselessly',
  andar: 'past',
};

export const sampleWithFullData: ILoteBlocoApartamento = {
  id: 'bdb0bd3d-e19c-4c6b-b741-5deec7abc5b4',
  bloco: 'scrimp knee',
  andar: 'leafy',
  numero: 'psst helo behind',
};

export const sampleWithNewData: NewLoteBlocoApartamento = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
