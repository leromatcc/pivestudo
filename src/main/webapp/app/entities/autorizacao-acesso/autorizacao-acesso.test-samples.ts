import dayjs from 'dayjs/esm';

import { IAutorizacaoAcesso, NewAutorizacaoAcesso } from './autorizacao-acesso.model';

export const sampleWithRequiredData: IAutorizacaoAcesso = {
  id: 'd1d05cbd-8e2c-4135-b822-816bda31cbb3',
  descricao: 'maim late deny',
  dataInicial: dayjs('2024-09-10T12:18'),
  dataFinal: dayjs('2024-09-11T04:06'),
  status: 'INATIVO',
};

export const sampleWithPartialData: IAutorizacaoAcesso = {
  id: '45d5e350-d953-41f9-9e43-e1e286c7c697',
  descricao: 'under beside whenever',
  dataInicial: dayjs('2024-09-10T11:22'),
  dataFinal: dayjs('2024-09-10T19:56'),
  status: 'EXPIRADO',
};

export const sampleWithFullData: IAutorizacaoAcesso = {
  id: '50cbb40b-df09-4f6d-b56c-175bd4fbe825',
  descricao: 'dish wherever unabashedly',
  dataInicial: dayjs('2024-09-10T13:22'),
  dataFinal: dayjs('2024-09-10T13:27'),
  status: 'INATIVO',
};

export const sampleWithNewData: NewAutorizacaoAcesso = {
  descricao: 'oh unto pish',
  dataInicial: dayjs('2024-09-10T09:16'),
  dataFinal: dayjs('2024-09-10T09:26'),
  status: 'INATIVO',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
