import dayjs from 'dayjs/esm';
import { IPontoAcesso } from 'app/entities/ponto-acesso/ponto-acesso.model';
import { IAutomovel } from 'app/entities/automovel/automovel.model';
import { IAutorizacaoAcesso } from 'app/entities/autorizacao-acesso/autorizacao-acesso.model';
import { TipoAcessoAutorizado } from 'app/entities/enumerations/tipo-acesso-autorizado.model';

export interface IRegistroAcesso {
  id: string;
  dataHora?: dayjs.Dayjs | null;
  cadeiaAnalisada?: string | null;
  acessoAutorizado?: keyof typeof TipoAcessoAutorizado | null;
  pontoAcesso?: IPontoAcesso | null;
  automovel?: IAutomovel | null;
  autorizacaoAcesso?: IAutorizacaoAcesso | null;
}

export type NewRegistroAcesso = Omit<IRegistroAcesso, 'id'> & { id: null };
