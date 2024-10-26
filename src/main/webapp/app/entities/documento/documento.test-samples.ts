import { IDocumento, NewDocumento } from './documento.model';

export const sampleWithRequiredData: IDocumento = {
  id: 'ee999a0b-0659-46d7-8df9-881a1b6eb83a',
  numeroDocumento: 'progress roughly unto',
};

export const sampleWithPartialData: IDocumento = {
  id: '15ed5ec5-23cd-4f63-9d52-3e610cef8203',
  tipoDocumento: 'RG',
  numeroDocumento: 'blue offensively',
  descricao: 'oval',
};

export const sampleWithFullData: IDocumento = {
  id: 'bb716fc6-be85-4945-b311-f2fe9a5cd406',
  tipoDocumento: 'RE',
  numeroDocumento: 'now free allocation',
  descricao: 'innocent plastic',
};

export const sampleWithNewData: NewDocumento = {
  numeroDocumento: 'terribly interestingly cannibalise',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
