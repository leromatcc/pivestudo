import { IEndereco, NewEndereco } from './endereco.model';

export const sampleWithRequiredData: IEndereco = {
  id: '20f8618f-4b5c-44dd-bd72-1f06b21634e1',
};

export const sampleWithPartialData: IEndereco = {
  id: 'c4ccc497-6742-4de3-b941-0bef20be3030',
  complemento: 'provided accomplished',
  cidade: 'oddly',
  estado: 'acceptance',
};

export const sampleWithFullData: IEndereco = {
  id: '013c3824-f102-4fae-8400-e2cfa382e697',
  descricao: 'deeply against familiar',
  cep: 'that',
  logradouro: 'incidentally tackle how',
  numero: 'soon fixed',
  complemento: 'corporal',
  referencia: 'past righteously sugar',
  cidade: 'moment beyond brr',
  estado: 'ew translation',
  pais: 'near hmph cardboard',
};

export const sampleWithNewData: NewEndereco = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
