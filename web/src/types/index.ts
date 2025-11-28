export interface Sala {
  id: number;
  nome: string;
  descricao?: string;
  localizacao: string;
  capacidade_alunos: number;
  area_m2: number;
  status: 'ativo' | 'manutencao' | 'inativo';
  criado_por: string;
  criado_em: string;
  ultima_atualizacao: string;
}

export interface ArCondicionado {
  id: number;
  sala_id: number;
  modelo: string;
  marca: string;
  numero_serie: string;
  capacidade_btu: number;
  status: 'funcionando' | 'manutencao' | 'defeito' | 'desligado';
  temperatura_atual?: number;
  temperatura_configurada?: number;
  filtro_limpo: boolean;
  ultima_manutencao: string;
  proxima_manutencao: string;
  criado_em: string;
  sala?: Sala;
}

export interface ManutencaoAr {
  id: number;
  ar_condicionado_id: number;
  tipo_manutencao: 'preventiva' | 'corretiva' | 'emergencial';
  descricao: string;
  tecnico_responsavel: string;
  data_inicio: string;
  data_fim?: string;
  status: 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  custo?: number;
  observacoes?: string;
  criado_em: string;
  ar_condicionado?: ArCondicionado;
}

export interface TipoManutencao {
  id: number;
  nome: string;
  descricao?: string;
  frequencia_dias: number;
  criado_em: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  telefone?: string;
}

export interface Localizacao {
  id: number;
  nome: string;
  predio: string;
  andar: string;
  setor: string;
}
