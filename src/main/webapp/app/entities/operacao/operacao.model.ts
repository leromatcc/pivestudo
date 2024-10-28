export interface IOperacao {
  id: number;
  arquivoImagem?: string | null;
  arquivoImagemContentType?: string | null;
}

export type NewOperacao = Omit<IOperacao, 'id'> & { id: null };
