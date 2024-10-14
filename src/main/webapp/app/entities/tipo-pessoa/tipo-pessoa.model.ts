import { ClassificaPessoa } from 'app/entities/enumerations/classifica-pessoa.model';

export interface ITipoPessoa {
  id: number;
  descricao?: string | null;
  grupo?: keyof typeof ClassificaPessoa | null;
}

export type NewTipoPessoa = Omit<ITipoPessoa, 'id'> & { id: null };
