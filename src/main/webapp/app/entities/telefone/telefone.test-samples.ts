import { ITelefone, NewTelefone } from './telefone.model';

export const sampleWithRequiredData: ITelefone = {
  id: '592a6dfe-0384-4156-a157-b802af0d011b',
  numero: 'regarding furthermore uh-huh',
};

export const sampleWithPartialData: ITelefone = {
  id: '273c3cc0-7268-4741-a88c-e7668156ecf4',
  tipoTelefone: 'dwell jubilant',
  numero: 'pervade for',
};

export const sampleWithFullData: ITelefone = {
  id: '202f16cc-210b-47f4-84b4-5989eb9d5032',
  tipoTelefone: 'eek',
  numero: 'vacillate on',
};

export const sampleWithNewData: NewTelefone = {
  numero: 'wild rightfully bleed',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
