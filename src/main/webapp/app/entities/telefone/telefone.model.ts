import { IPessoa } from 'app/entities/pessoa/pessoa.model';

export interface ITelefone {
  id: string;
  tipoTelefone?: string | null;
  numero?: string | null;
  pessoa?: IPessoa | null;
}

export type NewTelefone = Omit<ITelefone, 'id'> & { id: null };
