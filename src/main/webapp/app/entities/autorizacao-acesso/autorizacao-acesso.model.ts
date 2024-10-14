import dayjs from 'dayjs/esm';
import { IPessoa } from 'app/entities/pessoa/pessoa.model';
import { IEstabelecimento } from 'app/entities/estabelecimento/estabelecimento.model';
import { StatusAutorizacao } from 'app/entities/enumerations/status-autorizacao.model';

export interface IAutorizacaoAcesso {
  id: string;
  descricao?: string | null;
  dataInicial?: dayjs.Dayjs | null;
  dataFinal?: dayjs.Dayjs | null;
  status?: keyof typeof StatusAutorizacao | null;
  pessoa?: IPessoa | null;
  estabelecimento?: IEstabelecimento | null;
}

export type NewAutorizacaoAcesso = Omit<IAutorizacaoAcesso, 'id'> & { id: null };
