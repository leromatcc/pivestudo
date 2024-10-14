import { IDocumento, NewDocumento } from './documento.model';

export const sampleWithRequiredData: IDocumento = {
  id: 'd3809208-8f7e-4fea-a9f9-393a004ba0b6',
  numeroDocumento: 'unless',
};

export const sampleWithPartialData: IDocumento = {
  id: 'def1958a-8d10-4a31-82b8-62e6b98e3ca4',
  tipoDocumento: 'RE',
  numeroDocumento: 'thoughtfully potable modulo',
};

export const sampleWithFullData: IDocumento = {
  id: '9e4a52a3-f9c1-411b-b566-b7ed23251c58',
  tipoDocumento: 'CPF',
  numeroDocumento: 'worth ack defiantly',
  descricao: 'bah',
};

export const sampleWithNewData: NewDocumento = {
  numeroDocumento: 'pfft',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
