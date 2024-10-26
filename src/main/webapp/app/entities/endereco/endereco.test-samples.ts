import { IEndereco, NewEndereco } from './endereco.model';

export const sampleWithRequiredData: IEndereco = {
  id: 'bcdd2f62-641a-4c56-8f4c-4772e91bf0e0',
};

export const sampleWithPartialData: IEndereco = {
  id: '23865a01-c841-42a4-b02f-3267fb013a71',
  descricao: 'vision musty daily',
  cep: 'taxicab whenever',
  numero: 'woot exactly save',
  complemento: 'even structure',
  referencia: 'platter miserable',
  estado: 'unnaturally',
};

export const sampleWithFullData: IEndereco = {
  id: '14d9e443-b613-46b6-9e9c-f66edf08dbdf',
  descricao: 'against',
  cep: 'book content',
  logradouro: 'surprisingly',
  numero: 'urgently crossly lest',
  complemento: 'shyly yearly ew',
  referencia: 'so',
  cidade: 'technician',
  estado: 'gosh quickly',
  pais: 'whenever comfortable',
};

export const sampleWithNewData: NewEndereco = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
