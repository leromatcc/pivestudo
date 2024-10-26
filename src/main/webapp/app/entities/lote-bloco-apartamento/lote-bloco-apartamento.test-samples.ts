import { ILoteBlocoApartamento, NewLoteBlocoApartamento } from './lote-bloco-apartamento.model';

export const sampleWithRequiredData: ILoteBlocoApartamento = {
  id: '09812528-560c-415a-b477-7ca53934ee58',
};

export const sampleWithPartialData: ILoteBlocoApartamento = {
  id: 'cdd050ae-bbb3-4e9c-8b45-ecacbd370c15',
};

export const sampleWithFullData: ILoteBlocoApartamento = {
  id: '56eda03b-f7a6-4a32-b983-50160d3bff6c',
  bloco: 'lest mount',
  andar: 'form dearly handy',
  numero: 'since',
};

export const sampleWithNewData: NewLoteBlocoApartamento = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
