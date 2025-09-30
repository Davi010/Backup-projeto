import { Sala, ArCondicionado, ManutencaoAr, TipoManutencao, Usuario, Localizacao } from '../types';

export const salas: Sala[] = [
  {
    id: 1,
    nome: "Sala 101 - Matemática",
    descricao: "Sala de aula para disciplinas de matemática e estatística",
    localizacao: "Prédio A - 1º Andar",
    capacidade_alunos: 40,
    area_m2: 60,
    status: "ativo",
    criado_por: "João Silva",
    criado_em: "2024-01-01T00:00:00Z",
    ultima_atualizacao: "2024-01-15T07:30:00Z"
  },
  {
    id: 2,
    nome: "Sala 102 - Física",
    descricao: "Laboratório de física com equipamentos especializados",
    localizacao: "Prédio A - 1º Andar",
    capacidade_alunos: 35,
    area_m2: 80,
    status: "ativo",
    criado_por: "Maria Santos",
    criado_em: "2024-01-01T00:00:00Z",
    ultima_atualizacao: "2024-01-16T06:15:00Z"
  },
  {
    id: 3,
    nome: "Sala 201 - Química",
    descricao: "Laboratório de química com sistema de exaustão",
    localizacao: "Prédio A - 2º Andar",
    capacidade_alunos: 30,
    area_m2: 70,
    status: "manutencao",
    criado_por: "Pedro Costa",
    criado_em: "2024-01-01T00:00:00Z",
    ultima_atualizacao: "2024-01-17T08:30:00Z"
  },
  {
    id: 4,
    nome: "Sala 301 - Informática",
    descricao: "Laboratório de informática com 30 computadores",
    localizacao: "Prédio B - 3º Andar",
    capacidade_alunos: 30,
    area_m2: 90,
    status: "inativo",
    criado_por: "Ana Oliveira",
    criado_em: "2024-01-01T00:00:00Z",
    ultima_atualizacao: "2024-01-16T12:45:00Z"
  }
];

export const arCondicionados: ArCondicionado[] = [
  {
    id: 1,
    sala_id: 1,
    modelo: "Split Hi-Wall 12000 BTU",
    marca: "LG",
    numero_serie: "LG2024001",
    capacidade_btu: 12000,
    status: "funcionando",
    temperatura_atual: 22,
    temperatura_configurada: 22,
    filtro_limpo: true,
    ultima_manutencao: "2024-01-01T00:00:00Z",
    proxima_manutencao: "2024-04-01T00:00:00Z",
    criado_em: "2024-01-01T00:00:00Z",
    sala: salas[0]
  },
  {
    id: 2,
    sala_id: 2,
    modelo: "Split Hi-Wall 18000 BTU",
    marca: "Samsung",
    numero_serie: "SS2024002",
    capacidade_btu: 18000,
    status: "funcionando",
    temperatura_atual: 24,
    temperatura_configurada: 23,
    filtro_limpo: false,
    ultima_manutencao: "2024-01-01T00:00:00Z",
    proxima_manutencao: "2024-03-15T00:00:00Z",
    criado_em: "2024-01-01T00:00:00Z",
    sala: salas[1]
  },
  {
    id: 3,
    sala_id: 3,
    modelo: "Split Hi-Wall 24000 BTU",
    marca: "Daikin",
    numero_serie: "DK2024003",
    capacidade_btu: 24000,
    status: "manutencao",
    temperatura_atual: 28,
    temperatura_configurada: 22,
    filtro_limpo: false,
    ultima_manutencao: "2024-01-01T00:00:00Z",
    proxima_manutencao: "2024-02-01T00:00:00Z",
    criado_em: "2024-01-01T00:00:00Z",
    sala: salas[2]
  },
  {
    id: 4,
    sala_id: 4,
    modelo: "Split Hi-Wall 18000 BTU",
    marca: "Consul",
    numero_serie: "CS2024004",
    capacidade_btu: 18000,
    status: "defeito",
    temperatura_atual: 30,
    temperatura_configurada: 22,
    filtro_limpo: false,
    ultima_manutencao: "2024-01-01T00:00:00Z",
    proxima_manutencao: "2024-01-15T00:00:00Z",
    criado_em: "2024-01-01T00:00:00Z",
    sala: salas[3]
  }
];

export const tiposManutencao: TipoManutencao[] = [
  {
    id: 1,
    nome: "Limpeza de Filtros",
    descricao: "Limpeza e verificação dos filtros de ar",
    frequencia_dias: 30,
    criado_em: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    nome: "Verificação de Gás",
    descricao: "Verificação do nível de gás refrigerante",
    frequencia_dias: 90,
    criado_em: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    nome: "Limpeza de Evaporador",
    descricao: "Limpeza completa do evaporador e condensador",
    frequencia_dias: 180,
    criado_em: "2024-01-01T00:00:00Z"
  }
];

export const manutencoesAr: ManutencaoAr[] = [
  {
    id: 1,
    ar_condicionado_id: 1,
    tipo_manutencao: "preventiva",
    descricao: "Limpeza de filtros e verificação de temperatura",
    tecnico_responsavel: "Carlos Mendes",
    data_inicio: "2024-01-15T08:00:00Z",
    data_fim: "2024-01-15T10:00:00Z",
    status: "concluida",
    prioridade: "baixa",
    custo: 150.00,
    observacoes: "Filtros limpos, temperatura funcionando perfeitamente",
    criado_em: "2024-01-15T08:00:00Z",
    ar_condicionado: arCondicionados[0]
  },
  {
    id: 2,
    ar_condicionado_id: 3,
    tipo_manutencao: "corretiva",
    descricao: "Correção de vazamento de gás e limpeza de filtros",
    tecnico_responsavel: "Roberto Alves",
    data_inicio: "2024-01-17T08:00:00Z",
    status: "em_andamento",
    prioridade: "alta",
    custo: 450.00,
    observacoes: "Vazamento identificado, sendo corrigido",
    criado_em: "2024-01-17T08:00:00Z",
    ar_condicionado: arCondicionados[2]
  },
  {
    id: 3,
    ar_condicionado_id: 4,
    tipo_manutencao: "emergencial",
    descricao: "Reparo de compressor com defeito",
    tecnico_responsavel: "Fernando Lima",
    data_inicio: "2024-01-16T14:00:00Z",
    status: "agendada",
    prioridade: "critica",
    custo: 800.00,
    observacoes: "Compressor com ruído anormal, necessita substituição",
    criado_em: "2024-01-16T14:00:00Z",
    ar_condicionado: arCondicionados[3]
  }
];

export const usuarios: Usuario[] = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao.silva@instituicao.com",
    cargo: "Técnico de Manutenção",
    telefone: "(11) 99999-1111"
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria.santos@instituicao.com",
    cargo: "Engenheira de Manutenção",
    telefone: "(11) 99999-2222"
  },
  {
    id: 3,
    nome: "Pedro Costa",
    email: "pedro.costa@instituicao.com",
    cargo: "Supervisor de Manutenção",
    telefone: "(11) 99999-3333"
  }
];

export const localizacoes: Localizacao[] = [
  {
    id: 1,
    nome: "Prédio A",
    predio: "A",
    andar: "1º Andar",
    setor: "Ciências Exatas"
  },
  {
    id: 2,
    nome: "Prédio B",
    predio: "B",
    andar: "2º Andar",
    setor: "Tecnologia"
  },
  {
    id: 3,
    nome: "Prédio C",
    predio: "C",
    andar: "3º Andar",
    setor: "Administração"
  }
];
