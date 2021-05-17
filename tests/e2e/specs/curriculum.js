/*
 author 🥋: mSantana
 directory 📁: ~/development/paco/paco/tests/e2e/specs
 filename 📄: signUp.js
 stardate 🚀: 202104.18-10.08
 */
describe('signUp', () => {
  beforeEach(() => {
    cy.visit('/signup')
  })

  it('should show signup form', () => {
    // Labels inside the form container
    cy.get('[data-test="signup-form-container"]')
      .should('contain', 'Registrarse')
      .should('contain', 'Cédula profesional')
      .should('contain', 'Nombre')
      .should('contain', 'Apellido Paterno')
      .should('contain', 'Email')
      .should('contain', 'Confirmación de e-mail')
      .should('contain', 'Contraseña')
      .should('contain', 'Confirmación de contraseña')

    // Fields
    cy.get('[data-test="registration-license"]').should(
      'have.attr',
      'placeholder',
      'Cédula profesional de licenciatura en medicina'
    )
    cy.get('[data-test="registration-name"]').should('have.attr', 'placeholder', 'Nombres (ej. Juan Carlos)')
    cy.get('[data-test="registration-lastname-1"]').should(
      'have.attr',
      'placeholder',
      'Apellido Paterno (ej. González)'
    )
    cy.get('[data-test="registration-lastname-2"]').should('have.attr', 'placeholder', 'Apellido Materno (ej. Silveti)')
    cy.get('[data-test="registration-password"]').should('have.attr', 'placeholder', 'Contraseña')
    cy.get('[data-test="registration-password-confirmation"]').should(
      'have.attr',
      'placeholder',
      'Confirme su contraseña'
    )
    cy.get('[data-test="signup-submit"]').should('have.attr', 'value', 'Registrarse')
  })
})
