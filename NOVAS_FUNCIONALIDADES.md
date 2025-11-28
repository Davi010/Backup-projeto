# Novas Funcionalidades Implementadas

## 📋 Resumo

Foram adicionadas as seguintes funcionalidades ao sistema:

1. **Sidebar de Navegação** - Menu lateral para navegação entre páginas
2. **Página de Funcionários** - Cadastro e gerenciamento de funcionários responsáveis
3. **Página de Requisições** - Atrelar funcionários a requisições de manutenção
4. **Página de Relatórios** - Geração de relatórios em PDF
5. **Página de QR Code** - Geração de QR codes com informações das requisições

## 🚀 Como Executar

### 1. Executar Migrations do Backend

Primeiro, execute as migrations para criar as novas tabelas:

```bash
docker compose exec app php artisan migrate
```

Isso criará as tabelas:
- `employees` - Funcionários responsáveis
- `maintenance_requests` - Requisições de manutenção

### 2. Reiniciar os Containers (se necessário)

```bash
docker compose restart
```

### 3. Acessar o Sistema

Acesse `http://localhost:8080` e você verá a nova sidebar com as seguintes opções:

- **Dashboard** - Visão geral dos equipamentos (página original)
- **Funcionários** - Gerenciar funcionários
- **Requisições** - Criar e gerenciar requisições de manutenção
- **Relatórios** - Gerar relatórios em PDF
- **QR Code** - Gerar QR codes para salas

## 📁 Estrutura de Arquivos Criados

### Frontend

```
web/src/
├── components/
│   └── Sidebar.tsx                    # Componente de navegação lateral
├── pages/
│   ├── DashboardPage.tsx              # Página do dashboard
│   ├── FuncionariosPage.tsx           # Página de funcionários
│   ├── RequisicoesPage.tsx            # Página de requisições
│   ├── RelatoriosPage.tsx             # Página de relatórios
│   └── QRCodePage.tsx                 # Página de QR code
├── hooks/
│   ├── useEmployees.ts                # Hook para funcionários
│   └── useMaintenanceRequests.ts      # Hook para requisições
└── services/
    ├── employeeService.ts             # Serviço de funcionários
    └── maintenanceRequestService.ts   # Serviço de requisições
```

### Backend

```
app/
├── app/Models/
│   ├── Employee.php                   # Model de funcionários
│   └── MaintenanceRequest.php         # Model de requisições
├── app/Http/Controllers/
│   ├── EmployeeController.php         # Controller de funcionários
│   └── MaintenanceRequestController.php # Controller de requisições
└── database/migrations/
    ├── 2025_11_24_000001_create_employees_table.php
    └── 2025_11_24_000002_create_maintenance_requests_table.php
```

## 🔌 Endpoints da API

### Funcionários (`/api/employee`)

- `GET /api/employee` - Listar funcionários
- `POST /api/employee` - Criar funcionário
- `GET /api/employee/{id}` - Buscar funcionário
- `PATCH /api/employee/{id}` - Atualizar funcionário
- `DELETE /api/employee/{id}` - Deletar funcionário

### Requisições de Manutenção (`/api/maintenance-request`)

- `GET /api/maintenance-request` - Listar requisições
- `POST /api/maintenance-request` - Criar requisição
- `GET /api/maintenance-request/{id}` - Buscar requisição
- `PATCH /api/maintenance-request/{id}` - Atualizar requisição
- `DELETE /api/maintenance-request/{id}` - Deletar requisição

## 📦 Dependências Adicionadas

### Frontend

- `jspdf` - Geração de PDFs
- `react-qr-code` - Geração de QR codes
- `react-router-dom` - Roteamento (já estava instalado)

## 🎯 Funcionalidades Detalhadas

### 1. Sidebar

- Menu lateral fixo com navegação entre páginas
- Indicador visual da página ativa
- Ícones para cada seção

### 2. Funcionários

- Cadastro de funcionários com:
  - Nome (obrigatório)
  - Email (obrigatório, único)
  - Telefone (opcional)
  - Departamento (opcional)
- Listagem com busca
- Edição e exclusão de funcionários

### 3. Requisições de Manutenção

- Criação de requisições vinculando:
  - Equipamento (ar-condicionado)
  - Funcionário responsável
  - Sala
  - Descrição (opcional)
  - Status (pendente/concluída)
- Listagem com busca
- Marcar requisição como concluída

### 4. Relatórios

- Geração de PDF com:
  - Estatísticas gerais
  - Lista de requisições
  - Filtro por período (opcional)
- Download automático do PDF

### 5. QR Code

- Geração de QR code contendo:
  - Informações da sala
  - Equipamento
  - Funcionário responsável
  - Status da requisição
  - ID da requisição
  - Data de criação
- Download do QR code como imagem PNG

## 🔧 Próximos Passos (Opcional)

1. Adicionar autenticação/autorização
2. Adicionar validações mais robustas
3. Adicionar testes para as novas funcionalidades
4. Melhorar o design do PDF
5. Adicionar mais filtros nos relatórios
6. Adicionar exportação em outros formatos (Excel, CSV)

## ⚠️ Notas Importantes

- Certifique-se de executar as migrations antes de usar as novas funcionalidades
- Os dados são armazenados no banco de dados MySQL
- O QR code contém dados em JSON que podem ser lidos por qualquer leitor de QR code
- O PDF é gerado no frontend usando jsPDF

