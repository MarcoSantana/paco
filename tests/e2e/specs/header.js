//  _______ _______
//  |  |  | |______
//  |  |  | ______|
// author: mSantana
// createdAt 2020-05-05 11:45
// Stardate: 202005.05
// fileName: specs/header.js

describe('Navbar contains', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('Visits the app root URL', () => {
    cy.contains('header', 'Plataforma Administradora de Documentos')
  })
  it('Should have a home link', () => {
    cy.contains('have.attr', 'href', '/home')
  })
})
