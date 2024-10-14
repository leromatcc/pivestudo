import { ClassificaAutomovel } from 'app/entities/enumerations/classifica-automovel.model';

export interface ITipoAutomovel {
  id: string;
  descricao?: string | null;
  grupo?: keyof typeof ClassificaAutomovel | null;
}

export type NewTipoAutomovel = Omit<ITipoAutomovel, 'id'> & { id: null };
