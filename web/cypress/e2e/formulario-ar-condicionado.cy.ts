describe('Formulário de Ar Condicionado', () => {
  beforeEach(() => {
    // Mockar todas as requisições da API
    cy.intercept('GET', '**/api/brand**', { fixture: 'brands.json' }).as('getBrands');
    cy.intercept('GET', '**/api/model**', { fixture: 'models.json' }).as('getModels');
    cy.intercept('GET', '**/api/equipment**', { fixture: 'equipments.json' }).as('getEquipments');
    
    // Mockar criação de equipamento
    cy.intercept('POST', '**/api/equipment**', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          id: 999,
          name: 'Ar Condicionado Sala 101',
          model_id: 1,
          quantity: 2,
          btus: 12000,
          status: 'funcionando',
          notes: 'Equipamento novo instalado',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    }).as('createEquipment');
    
    // Mockar atualização de equipamento
    cy.intercept('PATCH', '**/api/equipment/**', {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          id: 1,
          name: 'Ar Condicionado Editado',
          model_id: 1,
          quantity: 3,
          btus: 12000,
          status: 'funcionando',
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    }).as('updateEquipment');
    
    // Visitar a página inicial
    cy.visit('/');
    
    // Aguardar a página carregar
    cy.get('body').should('be.visible');
    
    // Clicar no botão para adicionar novo ar-condicionado
    cy.get('[data-testid="btn-novo-equipamento"]', { timeout: 10000 }).should('be.visible').click();
    
    // Aguardar o formulário aparecer
    cy.get('[data-testid="equipment-form"]', { timeout: 10000 }).should('be.visible');
    
    // Aguardar carregamento das marcas e modelos (agora usando mocks)
    cy.wait(['@getBrands', '@getModels'], { timeout: 5000 });
  });

  describe('Validação de Campos Obrigatórios', () => {
    it('deve mostrar erros ao tentar submeter formulário vazio', () => {
      // Tentar submeter sem preencher nada
      cy.get('[data-testid="submit-button"]').click();

      // Aguardar validação executar (pode ser HTML5 ou JavaScript)
      cy.wait(1000);

      // Verificar se há erros visíveis ou se o campo está invalid (HTML5)
      cy.get('[data-testid="equipment-name-input"]').then(($input) => {
        const inputElement = $input[0] as HTMLInputElement;
        // Se o campo tem validação HTML5, verificar se está invalid
        if (inputElement.validity && !inputElement.validity.valid) {
          cy.get('[data-testid="equipment-name-input"]').should('have.attr', 'required');
        } else {
          // Se passou pela validação HTML5, verificar erro JavaScript
          cy.get('[data-testid="error-name"]', { timeout: 2000 }).should('be.visible')
            .and('contain', 'pelo menos 3 caracteres');
        }
      });
    });

    it('deve validar nome com menos de 3 caracteres', () => {
      cy.get('[data-testid="equipment-name-input"]').clear().type('AB');
      // Preencher modelo para passar validação HTML5
      cy.selectFirstModel();
      
      cy.get('[data-testid="submit-button"]').click();
      
      cy.wait(1000);
      cy.get('[data-testid="error-name"]', { timeout: 5000 }).should('be.visible')
        .and('contain', 'pelo menos 3 caracteres');
    });

    it('deve validar quantidade menor que 1', () => {
      cy.get('[data-testid="equipment-name-input"]').clear().type('Ar Condicionado Teste');
      // Selecionar modelo primeiro usando comando customizado
      cy.selectFirstModel();
      
      // Preencher outros campos obrigatórios primeiro
      cy.get('[data-testid="status-select"]').click();
      cy.wait(300);
      cy.get('[data-testid="status-option-funcionando"]').click({ force: true });
      cy.wait(300);
      
      // Remover validação HTML5 temporariamente para testar validação JavaScript
      cy.get('[data-testid="quantity-input"]').then(($input) => {
        $input[0].removeAttribute('min');
        $input[0].removeAttribute('required');
      });
      
      // Limpar quantidade e colocar 0
      cy.get('[data-testid="quantity-input"]').clear();
      cy.get('[data-testid="quantity-input"]').type('0', { force: true });
      
      // Remover foco do campo para garantir que a validação seja acionada
      cy.get('[data-testid="quantity-input"]').blur();
      cy.wait(500);
      
      // Clicar no botão de submit
      cy.get('[data-testid="submit-button"]').click();
      
      // Aguardar a validação ser processada
      cy.wait(2000);
      
      // Verificar erro de quantidade
      cy.get('[data-testid="error-quantity"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'pelo menos 1');
      
      // Verificar que o formulário não foi submetido
      cy.get('[data-testid="success-message"]').should('not.exist');
    });

    it('deve validar BTUs fora do range permitido', () => {
      cy.get('[data-testid="equipment-name-input"]').clear().type('Ar Condicionado Teste');
      // Selecionar modelo primeiro usando comando customizado
      cy.selectFirstModel();
      
      // Preencher outros campos obrigatórios
      cy.get('[data-testid="quantity-input"]').clear().type('1');
      cy.get('[data-testid="status-select"]').click();
      cy.wait(300);
      cy.get('[data-testid="status-option-funcionando"]').click({ force: true });
      cy.wait(300);
      
      // Remover validação HTML5 do campo BTUs se houver
      cy.get('[data-testid="btus-input"]').then(($input) => {
        $input[0].removeAttribute('min');
        $input[0].removeAttribute('max');
      });
      
      // Preencher BTUs com valor inválido
      cy.get('[data-testid="btus-input"]').clear();
      cy.get('[data-testid="btus-input"]').type('5000', { force: true });
      
      // Remover foco do campo para garantir que a validação seja acionada
      cy.get('[data-testid="btus-input"]').blur();
      cy.wait(500);
      
      // Clicar no botão de submit
      cy.get('[data-testid="submit-button"]').click();
      
      // Aguardar a validação ser processada
      cy.wait(2000);
      
      // Verificar erro de BTUs
      cy.get('[data-testid="error-btus"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'entre 7000 e 120000');
      
      // Verificar que o formulário não foi submetido
      cy.get('[data-testid="success-message"]').should('not.exist');
    });
  });

  describe('Formulário de Adicionar Ar Condicionado', () => {
    it('deve preencher e submeter formulário com sucesso', () => {
      // Aguardar marcas e modelos carregarem
      cy.wait(2000);

      // Usar comando customizado para preencher formulário
      cy.fillEquipmentForm({
        name: 'Ar Condicionado Sala 101',
        selectFirstModel: true,
        quantity: '2',
        btus: '12000',
        status: 'funcionando',
        notes: 'Equipamento novo instalado'
      });

      // Submeter formulário (mock já configurado no beforeEach)
      cy.get('[data-testid="submit-button"]').click();

      // Verificar se a requisição foi feita
      cy.wait('@createEquipment', { timeout: 10000 }).then((interception) => {
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
      // Preencher nome com menos de 3 caracteres e submeter
      cy.get('[data-testid="equipment-name-input"]').clear().type('AB');
      cy.get('[data-testid="submit-button"]').click();
      cy.wait(500);
      
      // Verificar erro existe
      cy.get('[data-testid="error-name"]', { timeout: 5000 }).should('be.visible');
      
      // Continuar preenchendo para 3+ caracteres
      cy.get('[data-testid="equipment-name-input"]').type('C');
      
      // Aguardar erro desaparecer
      cy.wait(500);
      cy.get('[data-testid="error-name"]').should('not.exist');
    });

    it('deve filtrar modelos por marca selecionada', () => {
      // Aguardar dados carregarem
      cy.wait(2000);

      // Selecionar uma marca
      cy.get('[data-testid="brand-filter-select"]').click();
      cy.wait(500);
      
      cy.get('[role="option"]').then(($options) => {
        const enabledBrands = Array.from($options).filter((option) => {
          const isDisabled = option.getAttribute('aria-disabled') === 'true' || 
                            option.hasAttribute('data-disabled');
          const isAllBrands = option.textContent?.includes('Todas as marcas');
          return !isDisabled && !isAllBrands;
        });
        
        if (enabledBrands.length > 0) {
          cy.wrap(enabledBrands[0]).click({ force: true });
        }
      });
      cy.wait(500);

      // Verificar que o modelo foi limpo
      cy.get('[data-testid="model-select"]').should('contain', 'Selecione');

      // Selecionar modelo (deve mostrar apenas modelos da marca selecionada)
      cy.get('[data-testid="model-select"]').click();
      cy.wait(500);
      
      cy.get('[role="option"]').then(($options) => {
        const enabledModels = Array.from($options).filter((option) => {
          const isDisabled = option.getAttribute('aria-disabled') === 'true' || 
                            option.hasAttribute('data-disabled');
          const isNoModel = option.textContent?.includes('Nenhum modelo');
          return !isDisabled && !isNoModel;
        });
        
        expect(enabledModels.length).to.be.greaterThan(0);
      });
    });
  });

  describe('Formulário de Editar Ar Condicionado', () => {
    beforeEach(() => {
      // O formulário recebe os dados via prop, não faz GET request
      // Então não precisamos mockar GET /api/equipment/:id
      
      // Voltar para a lista
      cy.get('[data-testid="btn-voltar"]').click();
      
      // Aguardar lista carregar (já mockada no beforeEach principal)
      cy.wait('@getEquipments', { timeout: 5000 });
      cy.wait(1000);
      
      // Verificar se há equipamentos na lista
      cy.get('table', { timeout: 10000 }).should('be.visible');
      
      // O botão de editar está dentro de um DropdownMenu
      // Primeiro, encontrar a primeira linha da tabela e clicar no botão de menu (três pontos)
      cy.get('table tbody tr').first().within(() => {
        // Procurar pelo botão que abre o dropdown (geralmente o último botão na célula de ações)
        cy.get('button').last().click({ force: true });
      });
      
      cy.wait(1000);
      
      // Agora clicar no item "Editar" que deve estar visível no dropdown
      cy.get('[data-testid="btn-editar-equipamento"]', { timeout: 5000 })
        .should('be.visible')
        .click();
      
      // Aguardar formulário de edição aparecer
      cy.get('[data-testid="equipment-form"]', { timeout: 10000 }).should('be.visible');
      
      // Aguardar um pouco para os dados serem preenchidos no formulário
      cy.wait(1000);
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

      // Submeter (mock já configurado no beforeEach principal)
      cy.get('[data-testid="submit-button"]').click();

      // Verificar requisição
      cy.wait('@updateEquipment', { timeout: 10000 }).then((interception) => {
        expect(interception.request.body).to.include({
          name: 'Ar Condicionado Editado',
          quantity: 3,
        });
      });

      // Verificar mensagem de sucesso
      cy.get('[data-testid="success-message"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'Equipamento salvo com sucesso');
    });

    it('deve validar campos mesmo no modo edição', () => {
      // Remover validação HTML5 temporariamente para testar validação JavaScript
      cy.get('[data-testid="equipment-name-input"]').then(($input) => {
        $input[0].removeAttribute('required');
      });
      
      // Limpar nome
      cy.get('[data-testid="equipment-name-input"]').clear();
      
      // Remover foco do campo para garantir que a validação seja acionada
      cy.get('[data-testid="equipment-name-input"]').blur();
      cy.wait(500);
      
      // Tentar submeter
      cy.get('[data-testid="submit-button"]').click();
      
      // Aguardar a validação ser processada
      cy.wait(1500);
      
      // Verificar erro
      cy.get('[data-testid="error-name"]', { timeout: 10000 })
        .should('be.visible')
        .and('contain', 'pelo menos 3 caracteres');
      
      // Verificar que o formulário não foi submetido
      cy.get('[data-testid="success-message"]').should('not.exist');
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
      cy.fillEquipmentForm({
        name: 'Teste',
        selectFirstModel: true
      });

      // Interceptar e atrasar resposta (sobrescrever mock padrão)
      cy.intercept('POST', '**/api/equipment**', {
        delay: 2000,
        statusCode: 200,
        body: { 
          status: 'success',
          data: {
            id: 999,
            name: 'Teste',
            model_id: 1,
            quantity: 1,
            status: 'funcionando'
          }
        },
      }).as('slowRequest');

      // Submeter
      cy.get('[data-testid="submit-button"]').click();

      // Verificar que botão está desabilitado
      cy.get('[data-testid="submit-button"]').should('be.disabled');
      cy.get('[data-testid="submit-button"]').should('contain', 'Salvando');
    });

    it('deve mostrar mensagem de erro quando API falha', () => {
      // Preencher formulário
      cy.fillEquipmentForm({
        name: 'Teste Erro',
        selectFirstModel: true
      });

      // Interceptar com erro (sobrescrever mock padrão)
      cy.intercept('POST', '**/api/equipment**', {
        statusCode: 500,
        body: { 
          status: 'error',
          message: 'Erro no servidor' 
        },
      }).as('errorRequest');

      // Submeter
      cy.get('[data-testid="submit-button"]').click();

      // Aguardar requisição
      cy.wait('@errorRequest', { timeout: 10000 });

      // Aguardar mensagem de erro aparecer
      cy.wait(1000);

      // Verificar mensagem de erro (case-insensitive)
      cy.get('[data-testid="error-message"]', { timeout: 10000 })
        .should('be.visible')
        .then(($el) => {
          const text = $el.text().toLowerCase();
          expect(text).to.satisfy((msg: string) => 
            msg.includes('erro') || msg.includes('servidor') || msg.includes('salvar')
          );
        });
    });
  });
});

