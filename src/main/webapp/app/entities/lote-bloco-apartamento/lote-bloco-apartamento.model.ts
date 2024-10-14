import { IEndereco } from 'app/entities/endereco/endereco.model';
import { IPessoa } from 'app/entities/pessoa/pessoa.model';

export interface ILoteBlocoApartamento {
  id: string;
  bloco?: string | null;
  andar?: string | null;
  numero?: string | null;
  endereco?: IEndereco | null;
  pessoa?: IPessoa | null;
}

export type NewLoteBlocoApartamento = Omit<ILoteBlocoApartamento, 'id'> & { id: null };
