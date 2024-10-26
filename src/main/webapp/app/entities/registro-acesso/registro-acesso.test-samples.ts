import dayjs from 'dayjs/esm';

import { IRegistroAcesso, NewRegistroAcesso } from './registro-acesso.model';

export const sampleWithRequiredData: IRegistroAcesso = {
  id: '94e48140-cbbd-409a-85ce-e32a2cc06fec',
  dataHora: dayjs('2024-09-11T04:11'),
  acessoAutorizado: 'ERRO',
};

export const sampleWithPartialData: IRegistroAcesso = {
  id: 'f6cce31e-a9e0-4020-aa0a-670099335ef5',
  dataHora: dayjs('2024-09-10T18:57'),
  acessoAutorizado: 'RECUSADO',
};

export const sampleWithFullData: IRegistroAcesso = {
  id: '22cd58b4-668e-42bf-8c5c-a323dd240774',
  dataHora: dayjs('2024-09-10T06:14'),
  cadeiaAnalisada: 'officially carouse atomize',
  acessoAutorizado: 'AUTORIZADO',
};

export const sampleWithNewData: NewRegistroAcesso = {
  dataHora: dayjs('2024-09-10T15:43'),
  acessoAutorizado: 'RECUSADO',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
