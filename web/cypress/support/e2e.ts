// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top;
if (app && app.document && app.document.head) {
  if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML =
      '.command-name-request, .command-name-xhr { display: none }';
    style.setAttribute('data-hide-command-log-request', '');
    app.document.head.appendChild(style);
  }
}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to wait for API to be ready
       * @example cy.waitForAPI()
       */
      waitForAPI(): Chainable<void>;
      
      /**
       * Custom command to fill equipment form
       * @example cy.fillEquipmentForm({ name: 'Test', selectFirstModel: true })
       */
      fillEquipmentForm(data: {
        name?: string;
        brand_id?: string;
        model_id?: string;
        selectFirstModel?: boolean;
        quantity?: string;
        btus?: string;
        status?: string;
        notes?: string;
      }): Chainable<void>;
      
      /**
       * Custom command to select first available model
       * @example cy.selectFirstModel()
       */
      selectFirstModel(): Chainable<void>;
    }
  }
}

