//  _______ _______
//  |  |  | |______
//  |  |  | ______|
// author: mSantana
// createdAt 2020-05-05 11:54
// Stardate: 202005.05
// fileName: specs/login.js

describe('/login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  // Actually just tests for the google login button
  it("greets with 'Ingreso'", () => {
    cy.contains('h1', 'Login page')
    cy.get('[data-test="login-btn"]').should('contain', 'Login with google')
  })
})
