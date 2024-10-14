import { IEstabelecimento } from 'app/entities/estabelecimento/estabelecimento.model';

export interface IPontoAcesso {
  id: string;
  descricao?: string | null;
  estabelecimento?: IEstabelecimento | null;
}

export type NewPontoAcesso = Omit<IPontoAcesso, 'id'> & { id: null };
