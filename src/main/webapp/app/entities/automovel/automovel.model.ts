import { ITipoAutomovel } from 'app/entities/tipo-automovel/tipo-automovel.model';
import { IPessoa } from 'app/entities/pessoa/pessoa.model';

export interface IAutomovel {
  id: string;
  placa?: string | null;
  descricao?: string | null;
  tipoAutomovel?: ITipoAutomovel | null;
  pessoa?: IPessoa | null;
}

export type NewAutomovel = Omit<IAutomovel, 'id'> & { id: null };
