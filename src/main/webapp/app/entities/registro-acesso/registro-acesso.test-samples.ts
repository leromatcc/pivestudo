import dayjs from 'dayjs/esm';

import { IRegistroAcesso, NewRegistroAcesso } from './registro-acesso.model';

export const sampleWithRequiredData: IRegistroAcesso = {
  id: '6459348e-7408-4615-b4a0-bc3babdd20c9',
  dataHora: dayjs('2024-09-10T13:13'),
  acessoAutorizado: 'AUTORIZADO',
};

export const sampleWithPartialData: IRegistroAcesso = {
  id: 'fcce3e33-f2da-4022-ac2c-20668fbe2cf0',
  dataHora: dayjs('2024-09-10T04:54'),
  cadeiaAnalisada: 'healthy',
  acessoAutorizado: 'RECUSADO',
};

export const sampleWithFullData: IRegistroAcesso = {
  id: 'c3ceeb39-12e3-4a99-abee-0e0d2703ae01',
  dataHora: dayjs('2024-09-10T16:06'),
  cadeiaAnalisada: 'sunrise for',
  acessoAutorizado: 'ERRO',
};

export const sampleWithNewData: NewRegistroAcesso = {
  dataHora: dayjs('2024-09-10T19:59'),
  acessoAutorizado: 'ERRO',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
