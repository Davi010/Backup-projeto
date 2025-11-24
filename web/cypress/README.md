# Testes E2E com Cypress

Este diretório contém os testes end-to-end (E2E) do projeto usando Cypress.

## 📋 Pré-requisitos

1. Ter o projeto rodando localmente
2. Frontend disponível em `http://localhost:5173`
3. Backend API disponível em `http://localhost:8080/api`

## 🚀 Como Executar os Testes

### Instalar dependências (se ainda não instalou)

```bash
cd web
npm install
```

### Abrir Cypress (Modo Interativo)

```bash
npm run cypress:open
```

Isso abrirá a interface gráfica do Cypress onde você pode:
- Ver os testes
- Executar testes individualmente
- Ver o navegador executando os testes em tempo real

### Executar Testes em Headless (CI/CD)

```bash
npm run cypress:run
```

Isso executa todos os testes sem abrir a interface gráfica.

### Executar Testes E2E

```bash
npm run test:e2e
```

## 📁 Estrutura dos Testes

```
cypress/
├── e2e/
│   └── formulario-ar-condicionado.cy.ts  # Testes do formulário
├── support/
│   ├── commands.ts                       # Comandos customizados
│   └── e2e.ts                            # Configuração de suporte
└── fixtures/                             # Dados de teste (opcional)
```

## 🧪 Testes Implementados

### Formulário de Ar Condicionado

#### Validação de Campos Obrigatórios
- ✅ Deve mostrar erros ao tentar submeter formulário vazio
- ✅ Deve validar nome com menos de 3 caracteres
- ✅ Deve validar quantidade menor que 1
- ✅ Deve validar BTUs fora do range permitido

#### Formulário de Adicionar
- ✅ Deve preencher e submeter formulário com sucesso
- ✅ Deve limpar erros ao começar a preencher campos
- ✅ Deve filtrar modelos por marca selecionada

#### Formulário de Editar
- ✅ Deve carregar dados do equipamento no formulário
- ✅ Deve atualizar equipamento com sucesso
- ✅ Deve validar campos mesmo no modo edição

#### Comportamento do Formulário
- ✅ Deve cancelar e voltar para a lista
- ✅ Deve desabilitar botão de salvar durante submissão
- ✅ Deve mostrar mensagem de erro quando API falha

## 🔧 Comandos Customizados

### `cy.waitForAPI()`
Aguarda as APIs de marcas e modelos estarem prontas.

### `cy.fillEquipmentForm(data)`
Preenche o formulário de equipamento com os dados fornecidos.

**Exemplo:**
```typescript
cy.fillEquipmentForm({
  name: 'Ar Condicionado Teste',
  model_id: '1',
  quantity: '2',
  btus: '12000',
  status: 'funcionando',
  notes: 'Notas de teste'
});
```

## 📝 Data Test IDs

Os componentes usam `data-testid` para facilitar os testes:

- `equipment-form` - Formulário principal
- `equipment-name-input` - Campo de nome
- `model-select` - Select de modelo
- `quantity-input` - Campo de quantidade
- `btus-input` - Campo de BTUs
- `status-select` - Select de status
- `notes-textarea` - Campo de notas
- `submit-button` - Botão de salvar
- `btn-cancelar` - Botão de cancelar
- `btn-voltar` - Botão de voltar
- `error-*` - Mensagens de erro
- `success-message` - Mensagem de sucesso

## 🐛 Troubleshooting

### Testes falhando porque elementos não são encontrados

1. Verifique se o frontend está rodando: `http://localhost:5173`
2. Verifique se há dados no banco (marcas e modelos)
3. Aumente o timeout nos testes se necessário

### API não está respondendo

1. Verifique se o backend está rodando: `http://localhost:8080/api`
2. Execute o script de configuração: `configurar-laravel.ps1`
3. Verifique os logs: `docker logs app`

### Testes muito lentos

1. Use `cy.intercept()` para mockar requisições quando possível
2. Reduza o número de testes que fazem requisições reais
3. Use `cy.wait()` apenas quando necessário

## 📚 Documentação

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)

