import { IUser } from 'app/entities/user/user.model';
import { ITipoPessoa } from 'app/entities/tipo-pessoa/tipo-pessoa.model';

export interface IPessoa {
  id: string;
  nome?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  tipoPessoa?: ITipoPessoa | null;
}

export type NewPessoa = Omit<IPessoa, 'id'> & { id: null };
