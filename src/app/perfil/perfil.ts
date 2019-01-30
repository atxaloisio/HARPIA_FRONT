export interface PerfilFilter {
  id: string;
  descricao: string;
}
export class Perfil {
  constructor(
    public id: number = null,
    public descricao: string = '',
    public cadastros: string = 'N',
    public cadastros_posto_trabalho: string = 'N',
    public cadastros_funcao: string = 'N',
    public cadastros_centro_custo: string = 'N',
    public cadastros_empresa: string = 'N',
    public cadastros_fornecedor: string = 'N',
    public processos: string = 'N',
    public processos_parametro_contrato: string = 'N',
    public processos_faturamento_contrato: string = 'N',
    public relatorios: string = 'N',
    public utilitarios: string = 'N',
    public utilitarios_sincronizar: string = 'N',
    public aclcontrol: string = 'N',
    public aclcontrol_usuario: string = 'N',
    public aclcontrol_redefinir_senha: string = 'N',
    public aclcontrol_usuario_empresa: string = 'N',
    public aclcontrol_perfil: string = 'N'
  ) {}
}
