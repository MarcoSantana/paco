/*
 author 🥋: mSantana
 directory 📁: ~/development/paco/paco/tests/e2e/specs
 filename 📄: signUp.js
 stardate 🚀: 202104.18-10.08
 */
describe('signUp', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/signup')
  })

  it('should show signup form', () => {
    // Labels inside the form container
    cy.get('[data-test="signup-form-container"]')
      .should('contain', 'Registrarse')
      .should('contain', 'Cédula profesional')
      .should('contain', 'Nombre')
      .should('contain', 'Apellido Paterno')
      .should('contain', 'Correo electrónico')
      .should('contain', 'Confirmación de correo electrónico')
      .should('contain', 'Contraseña')
      .should('contain', 'Confirmación de contraseña')

    // Fields
    cy.get('#registration-license-span')
      .should('exist')
      .contains('Cédula profesional')
    cy.get('[data-test="registration-license"]').should('exist')
    cy.get('[data-test="registration-name"]').should('exist')
    cy.get('[data-test="registration-name"]').should('exist')
    cy.get('[data-test="registration-lastname-1"]').should('exist')
    cy.get('[data-test="registration-lastname-2"]').should('exist')
    cy.get('[data-test="registration-password"]').should('exist')
    cy.get('[data-test="registration-password-confirmation"]').should('exist')
    cy.get('[data-test="signup-submit"]')
      .should('exist')
      .should('have.attr', 'disabled')
  })

  describe('validates license field', () => {
    it('accepts valid license', () => {
      cy.get('[data-test="registration-license"]')
        .click()
        .type('4273560')
      cy.get('#registration-license-span > .error--text').should('not.be.visible')
    })
    it('rejects text in license', () => {
      cy.get('[data-test="registration-license"]').type('a')
      cy.get('#registration-license-span > .error--text')
        .should('be.visible')
        .contains('Este campo debe ser numérico')

      cy.get('[data-test="registration-license"]').type('a1')
      cy.get('#registration-license-span > .error--text')
        .should('be.visible')
        .contains('Este campo debe ser numérico')

      cy.get('[data-test="registration-license"]').type('1a')
      cy.get('#registration-license-span > .error--text')
        .should('be.visible')
        .contains('Este campo debe ser numérico')

      cy.get('[data-test="registration-license"]').type('1aeoipuy')
      cy.get('#registration-license-span > .error--text')
        .should('be.visible')
        .contains('Este campo debe ser numérico')
      cy.get('[data-test="registration-loading-overlay"]').should('not.be.visible')
    })

    it('rejects wrong license field length', () => {
      cy.get('[data-test="registration-license"]').type('123')
      cy.get('#registration-license-span > .error--text')
        .should('be.visible')
        .contains('El campo debe ser de máximo 10 y mínimo 7 caracteres')
    })
  })

  describe('Triggers rest call on valid data', () => {
    it('Shows loading overlay', () => {
      cy.get('[data-test="registration-license"]').type(4273560)
      cy.wait(1000)
      cy.get('#cover-spin').should('be.visible')
    })

    it('Does not show loading overlay', () => {
      const id = '427356a'
      cy.get('[data-test="registration-license"]').type(id)
      cy.wait(1000)
      cy.get('#cover-spin').should('not.exist')
    })
  })
})
