import { IPontoAcesso } from 'app/entities/ponto-acesso/ponto-acesso.model';

export interface ICamera {
  id: number;
  descricao?: string | null;
  enderecoRede?: string | null;
  api?: string | null;
  pontoAcesso?: IPontoAcesso | null;
}

export type NewCamera = Omit<ICamera, 'id'> & { id: null };
