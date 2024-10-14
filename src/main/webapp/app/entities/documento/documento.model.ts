import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { TipoDocumento } from 'app/entities/enumerations/tipo-documento.model';

export interface IDocumento {
  id: string;
  tipoDocumento?: keyof typeof TipoDocumento | null;
  numeroDocumento?: string | null;
  descricao?: string | null;
  pessoa?: IPessoa | null;
}

export type NewDocumento = Omit<IDocumento, 'id'> & { id: null };
