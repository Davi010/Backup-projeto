describe('Formulário de Ar Condicionado', () => {
  beforeEach(() => {
    // Visitar a página inicial
    cy.visit('/');
    
    // Aguardar a página carregar
    cy.get('body').should('be.visible');
    
    // Aguardar API estar pronta (marcas e modelos)
    cy.intercept('GET', '**/api/brand**').as('getBrands');
    cy.intercept('GET', '**/api/model**').as('getModels');
    
    // Clicar no botão para adicionar novo ar-condicionado
    cy.get('[data-testid="btn-novo-equipamento"]', { timeout: 10000 }).should('be.visible').click();
    
    // Aguardar o formulário aparecer
    cy.get('[data-testid="equipment-form"]', { timeout: 10000 }).should('be.visible');
    
    // Aguardar carregamento das marcas e modelos
    cy.wait(['@getBrands', '@getModels'], { timeout: 15000 });
  });

  describe('Validação de Campos Obrigatórios', () => {
    it('deve mostrar erros ao tentar submeter formulário vazio', () => {
      // Tentar submeter sem preencher nada
      cy.get('[data-testid="submit-button"]').click();

      // Verificar mensagens de erro
      cy.get('[data-testid="error-name"]').should('be.visible')
        .and('contain', 'pelo menos 3 caracteres');
      
      cy.get('[data-testid="error-model_id"]').should('be.visible')
        .and('contain', 'obrigatório');
    });

    it('deve validar nome com menos de 3 caracteres', () => {
      cy.get('[data-testid="equipment-name-input"]').type('AB');
      cy.get('[data-testid="submit-button"]').click();
      
      cy.get('[data-testid="error-name"]').should('be.visible')
        .and('contain', 'pelo menos 3 caracteres');
    });

    it('deve validar quantidade menor que 1', () => {
      cy.get('[data-testid="equipment-name-input"]').type('Ar Condicionado Teste');
      cy.get('[data-testid="quantity-input"]').clear().type('0');
      cy.get('[data-testid="submit-button"]').click();
      
      cy.get('[data-testid="error-quantity"]').should('be.visible')
        .and('contain', 'pelo menos 1');
    });

    it('deve validar BTUs fora do range permitido', () => {
      cy.get('[data-testid="equipment-name-input"]').type('Ar Condicionado Teste');
      cy.get('[data-testid="btus-input"]').clear().type('5000');
      cy.get('[data-testid="submit-button"]').click();
      
      cy.get('[data-testid="error-btus"]').should('be.visible')
        .and('contain', 'entre 7000 e 120000');
    });
  });

  describe('Formulário de Adicionar Ar Condicionado', () => {
    it('deve preencher e submeter formulário com sucesso', () => {
      // Aguardar marcas e modelos carregarem
      cy.wait(2000);

      // Preencher nome
      cy.get('[data-testid="equipment-name-input"]').type('Ar Condicionado Sala 101');

      // Selecionar marca (se houver marcas disponíveis)
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="brand-filter-select"]').length > 0) {
          cy.get('[data-testid="brand-filter-select"]').click();
          // Selecionar primeira opção de marca (exceto "Todas as marcas")
          cy.get('[role="option"]').contains('Todas as marcas').should('exist');
          cy.get('[role="option"]').not(':contains("Todas as marcas")').first().click();
        }
      });

      // Selecionar modelo (aguardar opções aparecerem)
      cy.get('[data-testid="model-select"]').click();
      // Selecionar primeira opção de modelo disponível
      cy.get('[role="option"]').not(':contains("Nenhum modelo")').first().click();

      // Preencher quantidade
      cy.get('[data-testid="quantity-input"]').clear().type('2');

      // Preencher BTUs
      cy.get('[data-testid="btus-input"]').clear().type('12000');

      // Selecionar status
      cy.get('[data-testid="status-select"]').click();
      cy.get('[data-testid="status-option-funcionando"]').click();

      // Preencher notas
      cy.get('[data-testid="notes-textarea"]').type('Equipamento novo instalado');

      // Interceptar requisição de criação
      cy.intercept('POST', '**/api/equipment**').as('createEquipment');

      // Submeter formulário
      cy.get('[data-testid="submit-button"]').click();

      // Verificar se a requisição foi feita
      cy.wait('@createEquipment').then((interception) => {
        expect(interception.request.body).to.include({
          name: 'Ar Condicionado Sala 101',
          quantity: 2,
          btus: 12000,
          status: 'funcionando',
        });
      });

      // Verificar mensagem de sucesso
      cy.get('[data-testid="success-message"]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'sucesso');
    });

    it('deve limpar erros ao começar a preencher campos', () => {
      // Tentar submeter vazio
      cy.get('[data-testid="submit-button"]').click();
      
      // Verificar erro
      cy.get('[data-testid="error-name"]').should('be.visible');
      
      // Começar a preencher
      cy.get('[data-testid="equipment-name-input"]').type('A');
      
      // Erro deve desaparecer
      cy.get('[data-testid="error-name"]').should('not.exist');
    });

    it('deve filtrar modelos por marca selecionada', () => {
      // Aguardar dados carregarem
      cy.wait(2000);

      // Selecionar uma marca
      cy.get('[data-testid="brand-filter-select"]').click();
      cy.get('[role="option"]').not(':contains("Todas as marcas")').first().click();

      // Verificar que o modelo foi limpo
      cy.get('[data-testid="model-select"]').should('contain', 'Selecione');

      // Selecionar modelo (deve mostrar apenas modelos da marca selecionada)
      cy.get('[data-testid="model-select"]').click();
      cy.get('[role="option"]').not(':contains("Nenhum modelo")').should('have.length.greaterThan', 0);
    });
  });

  describe('Formulário de Editar Ar Condicionado', () => {
    beforeEach(() => {
      // Voltar para a lista
      cy.get('[data-testid="btn-voltar"]').click();
      
      // Aguardar lista carregar
      cy.wait(2000);
      
      // Clicar no botão de editar do primeiro equipamento
      cy.get('[data-testid="btn-editar-equipamento"]', { timeout: 10000 })
        .first()
        .click();
      
      // Aguardar formulário de edição aparecer
      cy.get('[data-testid="equipment-form"]', { timeout: 10000 }).should('be.visible');
    });

    it('deve carregar dados do equipamento no formulário', () => {
      // Verificar se o título indica edição
      cy.get('h1').should('contain', 'Editar Ar Condicionado');

      // Verificar se os campos estão preenchidos
      cy.get('[data-testid="equipment-name-input"]').should('not.have.value', '');
      cy.get('[data-testid="quantity-input"]').should('not.have.value', '');
    });

    it('deve atualizar equipamento com sucesso', () => {
      // Modificar nome
      cy.get('[data-testid="equipment-name-input"]').clear().type('Ar Condicionado Editado');

      // Modificar quantidade
      cy.get('[data-testid="quantity-input"]').clear().type('3');

      // Interceptar requisição de atualização
      cy.intercept('PATCH', '**/api/equipment/**').as('updateEquipment');

      // Submeter
      cy.get('[data-testid="submit-button"]').click();

      // Verificar requisição
      cy.wait('@updateEquipment').then((interception) => {
        expect(interception.request.body).to.include({
          name: 'Ar Condicionado Editado',
          quantity: 3,
        });
      });

      // Verificar mensagem de sucesso
      cy.get('[data-testid="success-message"]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'sucesso');
    });

    it('deve validar campos mesmo no modo edição', () => {
      // Limpar nome
      cy.get('[data-testid="equipment-name-input"]').clear();
      
      // Tentar submeter
      cy.get('[data-testid="submit-button"]').click();
      
      // Verificar erro
      cy.get('[data-testid="error-name"]').should('be.visible');
    });
  });

  describe('Comportamento do Formulário', () => {
    it('deve cancelar e voltar para a lista', () => {
      cy.get('[data-testid="btn-cancelar"]').click();
      
      // Deve voltar para a lista (formulário não deve estar visível)
      cy.get('[data-testid="equipment-form"]').should('not.exist');
    });

    it('deve desabilitar botão de salvar durante submissão', () => {
      // Preencher formulário válido
      cy.get('[data-testid="equipment-name-input"]').type('Teste');
      
      cy.wait(2000);
      cy.get('[data-testid="model-select"]').click();
      cy.get('[role="option"]').not(':contains("Nenhum modelo")').first().click();

      // Interceptar e atrasar resposta
      cy.intercept('POST', '**/api/equipment**', {
        delay: 2000,
        statusCode: 200,
        body: { status: 'success' },
      }).as('slowRequest');

      // Submeter
      cy.get('[data-testid="submit-button"]').click();

      // Verificar que botão está desabilitado
      cy.get('[data-testid="submit-button"]').should('be.disabled');
      cy.get('[data-testid="submit-button"]').should('contain', 'Salvando');
    });

    it('deve mostrar mensagem de erro quando API falha', () => {
      // Preencher formulário
      cy.get('[data-testid="equipment-name-input"]').type('Teste Erro');
      
      cy.wait(2000);
      cy.get('[data-testid="model-select"]').click();
      cy.get('[role="option"]').not(':contains("Nenhum modelo")').first().click();

      // Interceptar com erro
      cy.intercept('POST', '**/api/equipment**', {
        statusCode: 500,
        body: { message: 'Erro no servidor' },
      }).as('errorRequest');

      // Submeter
      cy.get('[data-testid="submit-button"]').click();

      // Verificar mensagem de erro
      cy.get('[data-testid="error-message"]', { timeout: 5000 })
        .should('be.visible')
        .and('contain', 'erro');
    });
  });
});

