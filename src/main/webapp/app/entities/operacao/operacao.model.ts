export interface IOperacao {
  id: number;
  descricao?: string | null;
}

export type NewOperacao = Omit<IOperacao, 'id'> & { id: null };
