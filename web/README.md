# Sistema de Controle de Ar Condicionado - Salas de Aula

Interface web para gerenciamento e controle de aparelhos de ar condicionado das salas de aula, baseada no padrão visual moderno do Shadcn/UI.

## 🚀 Funcionalidades

- **Dashboard Principal**: Visão geral com estatísticas em tempo real
- **Controle de Salas**: Gerenciamento de salas de aula e suas localizações
- **Monitoramento de Ar Condicionado**: Status, temperatura e próximas manutenções
- **Sistema de Manutenção**: Agendamento e acompanhamento de manutenções
- **Cadastro de Equipamentos**: Formulário completo para novos aparelhos

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Shadcn/UI** para componentes de interface
- **Tailwind CSS** para estilização
- **Vite** como bundler
- **Radix UI** para componentes acessíveis
- **Lucide React** para ícones

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🚀 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd sistema-ar-condicionado
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API:
```bash
# Crie um arquivo .env na pasta web/ com:
VITE_API_BASE_URL=http://localhost:8080/api
```

4. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

5. Abra o navegador em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base do Shadcn/UI
│   ├── DashboardArCondicionado.tsx    # Dashboard principal
│   └── FormularioArCondicionado.tsx   # Formulário de cadastro
├── services/           # Serviços de API
│   ├── api.ts          # Configuração base da API
│   ├── brandService.ts
│   ├── modelService.ts
│   ├── equipmentService.ts
│   └── maintenanceService.ts
├── hooks/              # Hooks customizados
│   ├── useBrands.ts
│   ├── useModels.ts
│   ├── useEquipments.ts
│   └── useMaintenances.ts
├── types/              # Definições de tipos TypeScript
├── data/               # Dados mock para demonstração
├── lib/                # Utilitários
├── App.tsx             # Componente principal
└── main.tsx            # Ponto de entrada
```

## 🎯 Como Usar

### Dashboard Principal
- **Cards de Resumo**: Visualize total de aparelhos, funcionando, em manutenção e com defeito
- **Filtros**: Busque por sala, localização ou modelo específico
- **Tabela**: Lista completa de todos os aparelhos com status e informações

### Cadastro de Novo Equipamento
- Clique no botão "+ Novo Ar Condicionado"
- Preencha as informações obrigatórias:
  - **Nome do Equipamento**: Mínimo de 3 caracteres
  - **Marca e Modelo**: Selecione da lista carregada do backend
  - **Quantidade**: Mínimo de 1 unidade
- Configure notas adicionais (opcional)
- Salve ou cancele a operação

### Navegação
- **Voltar**: Use o botão "← Voltar" para retornar ao dashboard
- **API Docs**: Acesse a documentação da API
- **Filtros**: Utilize a busca e filtros avançados

## ✅ Validação e Backend

### Validação de Formulários
O sistema possui validação completa em dois níveis:

1. **Validação no Frontend**: 
   - Campos obrigatórios verificados antes do envio
   - Mensagens de erro em tempo real
   - Feedback visual para campos inválidos

2. **Validação no Backend**:
   - Regras de negócio aplicadas no Laravel
   - Proteção contra dados inválidos
   - Mensagens de erro retornadas da API

### Conexão com Backend
O frontend está completamente integrado com a API Laravel:

- **Marcas (Brands)**: GET, POST, PUT, DELETE
- **Modelos (Models)**: GET, POST, PUT, DELETE
- **Equipamentos (Equipment)**: GET, POST, PUT, DELETE
- **Manutenções (Maintenances)**: GET, POST, PATCH, DELETE

Todos os serviços utilizam:
- Tratamento de erros robusto
- Estados de loading
- Paginação automática
- Filtros e ordenação
- Relacionamentos entre modelos (Brand → Models → Equipment)

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção

## 📊 Schema do Sistema

A interface é baseada no seguinte modelo de dados:

- **Salas**: Informações das salas de aula (nome, localização, capacidade)
- **Ar Condicionado**: Especificações técnicas e status dos aparelhos
- **Manutenções**: Agendamento e acompanhamento de serviços
- **Tipos de Manutenção**: Categorias e frequências de manutenção
- **Usuários**: Técnicos e responsáveis pelo sistema

## 🎨 Características da Interface

- **Design Moderno**: Seguindo o padrão visual do Shadcn/UI
- **Totalmente Responsiva**: Funciona perfeitamente em mobile e desktop
- **Cores Intuitivas**: Status coloridos para fácil identificação
- **Ícones Claros**: Uso de ícones Lucide para melhor UX
- **Navegação Simples**: Transições suaves entre telas

## 📱 Responsividade

A interface é totalmente responsiva e funciona bem em:
- 📱 Dispositivos móveis
- 💻 Tablets
- 🖥️ Desktops
- 🖥️ Monitores grandes

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através das issues do repositório.
