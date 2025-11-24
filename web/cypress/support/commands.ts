/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('waitForAPI', () => {
  // Wait for API to be ready by checking if the page loads
  cy.intercept('GET', '**/api/brand**').as('getBrands');
  cy.intercept('GET', '**/api/model**').as('getModels');
  
  // Wait for initial API calls
  cy.wait(['@getBrands', '@getModels'], { timeout: 10000 });
});

Cypress.Commands.add('fillEquipmentForm', (data) => {
  // Fill name
  if (data.name) {
    cy.get('[data-testid="equipment-name-input"]').clear().type(data.name);
  }

  // Select brand (if provided)
  if (data.brand_id) {
    cy.get('[data-testid="brand-filter-select"]').click();
    cy.get(`[data-testid="brand-option-${data.brand_id}"]`).click();
  }

  // Select model
  if (data.model_id) {
    cy.get('[data-testid="model-select"]').click();
    cy.get(`[data-testid="model-option-${data.model_id}"]`).click();
  }

  // Fill quantity
  if (data.quantity) {
    cy.get('[data-testid="quantity-input"]').clear().type(data.quantity);
  }

  // Fill BTUs
  if (data.btus) {
    cy.get('[data-testid="btus-input"]').clear().type(data.btus);
  }

  // Select status
  if (data.status) {
    cy.get('[data-testid="status-select"]').click();
    cy.get(`[data-testid="status-option-${data.status}"]`).click();
  }

  // Fill notes
  if (data.notes) {
    cy.get('[data-testid="notes-textarea"]').clear().type(data.notes);
  }
});

export {};

