import dayjs from 'dayjs/esm';

import { IImagem, NewImagem } from './imagem.model';

export const sampleWithRequiredData: IImagem = {
  id: 'f5af7e84-8ba8-45f9-b96a-0b03dc0c6329',
  arquivoImagem: '../fake-data/blob/hipster.png',
  arquivoImagemContentType: 'unknown',
  nome: 'since always beside',
  caminho: 'however',
};

export const sampleWithPartialData: IImagem = {
  id: '274143be-f151-43b3-9385-20de693d4c8b',
  arquivoImagem: '../fake-data/blob/hipster.png',
  arquivoImagemContentType: 'unknown',
  nome: 'while verbally tarragon',
  caminho: 'sell',
  cadeiaDetectada: 'behind fuzzy',
};

export const sampleWithFullData: IImagem = {
  id: '5a7a30fa-a678-4cfc-86f8-43eddf9c7ed1',
  arquivoImagem: '../fake-data/blob/hipster.png',
  arquivoImagemContentType: 'unknown',
  nome: 'ick geez',
  caminho: 'sweetly',
  descricao: 'slide',
  cadeiaDetectada: 'married',
  dateAnalise: dayjs('2024-09-10T16:34'),
};

export const sampleWithNewData: NewImagem = {
  arquivoImagem: '../fake-data/blob/hipster.png',
  arquivoImagemContentType: 'unknown',
  nome: 'briskly fork',
  caminho: 'ick',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
