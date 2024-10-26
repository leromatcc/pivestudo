import dayjs from 'dayjs/esm';

import { IAutorizacaoAcesso, NewAutorizacaoAcesso } from './autorizacao-acesso.model';

export const sampleWithRequiredData: IAutorizacaoAcesso = {
  id: '15286d3c-bcc4-4587-99f7-35304de5d519',
  descricao: 'finally quietly sinful',
  dataInicial: dayjs('2024-09-10T05:06'),
  dataFinal: dayjs('2024-09-11T00:08'),
  status: 'ATIVO',
};

export const sampleWithPartialData: IAutorizacaoAcesso = {
  id: 'fd615dfe-2f0c-4644-b406-2ddaee3b013e',
  descricao: 'than',
  dataInicial: dayjs('2024-09-10T11:50'),
  dataFinal: dayjs('2024-09-10T10:12'),
  status: 'EXPIRADO',
};

export const sampleWithFullData: IAutorizacaoAcesso = {
  id: 'c59236be-8c23-4d05-bbc9-7bb510bbae59',
  descricao: 'sans',
  dataInicial: dayjs('2024-09-10T20:51'),
  dataFinal: dayjs('2024-09-10T12:58'),
  status: 'EXPIRADO',
};

export const sampleWithNewData: NewAutorizacaoAcesso = {
  descricao: 'anti gosh',
  dataInicial: dayjs('2024-09-10T21:25'),
  dataFinal: dayjs('2024-09-10T12:37'),
  status: 'ATIVO',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
