//  _______ _______
//  |  |  | |______
//  |  |  | ______|
// author: mSantana
// createdAt 2020-05-05 10:37
// fileName: specs/test.js

describe('Home', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'Plataforma Administradora de Documentos')
    cy.url().should('include', '/home')
  })
})
