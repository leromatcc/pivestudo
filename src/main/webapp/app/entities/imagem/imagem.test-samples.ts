import dayjs from 'dayjs/esm';

import { IImagem, NewImagem } from './imagem.model';

export const sampleWithRequiredData: IImagem = {
  id: 'ad64ea6c-a896-42d4-b4e2-304af3c4ab37',
  nome: 'alongside sweetly onto',
  caminho: 'sadly coolly careless',
};

export const sampleWithPartialData: IImagem = {
  id: 'f69811c9-03e5-4e94-8408-ac5e886ca2f1',
  nome: 'across',
  caminho: 'unless minus',
  cadeiaDetectada: 'oleo',
  dateAnalise: dayjs('2024-09-10T07:22'),
};

export const sampleWithFullData: IImagem = {
  id: 'cb2914a6-db24-460e-a98a-0e929fdf5cc3',
  nome: 'aboard transpire daily',
  caminho: 'throughout',
  descricao: 'clear-cut automatic',
  cadeiaDetectada: 'onto',
  dateAnalise: dayjs('2024-09-10T04:59'),
};

export const sampleWithNewData: NewImagem = {
  nome: 'gadget naturalise where',
  caminho: 'film beatboxer',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
