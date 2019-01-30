export interface PostoTrabalhoFilter {
  id: string;
  descricao: string;
}

export class PostoTrabalho {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public created_at: string = '',
    public updated_at: string = ''
  ) {}
}
