export interface ISobre {
  id: number;
  descricao?: string | null;
}

export type NewSobre = Omit<ISobre, 'id'> & { id: null };
