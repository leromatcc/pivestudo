import { IPessoa } from 'app/entities/pessoa/pessoa.model';

export interface IEndereco {
  id: string;
  descricao?: string | null;
  cep?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  referencia?: string | null;
  cidade?: string | null;
  estado?: string | null;
  pais?: string | null;
  pessoa?: IPessoa | null;
}

export type NewEndereco = Omit<IEndereco, 'id'> & { id: null };
