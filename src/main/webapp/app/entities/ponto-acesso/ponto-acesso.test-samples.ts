import { IPontoAcesso, NewPontoAcesso } from './ponto-acesso.model';

export const sampleWithRequiredData: IPontoAcesso = {
  id: 'a28173d7-ca04-4eeb-97ab-9fe846e2de1a',
  descricao: 'who',
};

export const sampleWithPartialData: IPontoAcesso = {
  id: '912c5f3d-a206-4ace-ad0a-283c054874be',
  descricao: 'times',
};

export const sampleWithFullData: IPontoAcesso = {
  id: '0a2f8613-9d84-404d-8b99-3744f80eaa8f',
  descricao: 'mmm by',
};

export const sampleWithNewData: NewPontoAcesso = {
  descricao: 'educated geez positively',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
