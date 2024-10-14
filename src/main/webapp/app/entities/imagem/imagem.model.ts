import dayjs from 'dayjs/esm';
import { IRegistroAcesso } from 'app/entities/registro-acesso/registro-acesso.model';

export interface IImagem {
  id: string;
  nome?: string | null;
  caminho?: string | null;
  descricao?: string | null;
  cadeiaDetectada?: string | null;
  dateAnalise?: dayjs.Dayjs | null;
  registroAcesso?: IRegistroAcesso | null;
}

export type NewImagem = Omit<IImagem, 'id'> & { id: null };
