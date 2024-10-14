import { IEndereco } from 'app/entities/endereco/endereco.model';

export interface IEstabelecimento {
  id: string;
  descricao?: string | null;
  endereco?: IEndereco | null;
}

export type NewEstabelecimento = Omit<IEstabelecimento, 'id'> & { id: null };
