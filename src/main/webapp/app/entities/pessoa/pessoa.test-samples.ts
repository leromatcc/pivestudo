import { IPessoa, NewPessoa } from './pessoa.model';

export const sampleWithRequiredData: IPessoa = {
  id: 'e3eec370-b1cd-4c3c-a30a-ac8f76509819',
  nome: 'behind',
};

export const sampleWithPartialData: IPessoa = {
  id: '45b91c15-bf2e-4cf0-8b91-21fa86e9b871',
  nome: 'fine bah via',
};

export const sampleWithFullData: IPessoa = {
  id: '5cbf3a4c-59e9-4f05-a724-48411e0750bc',
  nome: 'for finished since',
};

export const sampleWithNewData: NewPessoa = {
  nome: 'tuber',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
