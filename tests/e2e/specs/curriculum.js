// / <reference types="cypress"> />
/* 
 author 🥋: mSantana 
 directory 📁: ~/development/paco/paco/tests/e2e/specs 
 filename 📄: curriculum.js 
 stardate 🚀: 202105.17-19.45 
 */
import Chance from 'chance'

const chance = new Chance()

describe('Curriculum', () => {
  beforeEach(() => {
    cy.logout()
    cy.visit('/login')
    // cy.login('marco.santana@gmail.com', 'A12345678a')
    cy.login()
  })

  it('should create a valid curriculum', () => {
    context('should have the proper title', () => {
      cy.get('div .vue-form-wizard').should('contain', 'Cargar nuevo documento')
      cy.get('#document-type').should('contain', 'Curriculum Vitae')
      cy.get('#document-type').select('Curriculum Vitae')
      cy.wait(2000) // wait for 2 seconds
      cy.get('[data-test=document-next-btn]').should('exist')
      cy.get('[data-test=document-next-btn]').click()
      cy.get('.wizard-tab-content').should('contain', 'Formulario para anexar Curriculum Vitae')
    })

    // First name
    context('first name', () => {
      cy.get('[data-test=curriculum-user-firstName]').should('exist')
      cy.get('[data-test=curriculum-user-firstName]').as('firstName')
      cy.get('@firstName').type(chance.string())
      cy.get('.errors > span').should('contain', 'Formato inválido')
      cy.focused().clear() // Clear focused input/textarea
      cy.get('.errors > span').should('not.contain', 'Formato inválido')
      cy.get('@firstName').type('Marco Antonio')
      cy.get('.errors > span').should('not.contain', 'Formato inválido')
    })

    // Last Name 1
    context('last name 1', () => {
      cy.get('[data-test=curriculum-user-lastName1]').as('lastName1')
      cy.get('@lastName1').type(chance.string())
      cy.get('.errors > span').should('contain', 'Formato inválido')
      cy.focused().clear() // Clear focused input/textarea
      cy.get('.errors > span').should('not.contain', 'Formato inválido')
      cy.get('@lastName1').type('Santana')
      cy.get('.errors > span').should('not.contain', 'Formato inválido')
    })

    // Last Name 2
    context('last name 2', () => {
      cy.get('[data-test=curriculum-user-lastName2]').as('lastName2')
      cy.get('@lastName2').type(chance.string())
      cy.get('.errors > span').should('contain', 'Formato inválido')
      cy.focused().clear() // Clear focused input/textarea
      cy.get('.errors > span').should('not.contain', 'Formato inválido')
      cy.get('@lastName2').type('Borrego')
      cy.get('.errors > span').should('not.contain', 'Formato inválido')
    })

    // RFC
    // TODO Add a faker lib to type random string to test really the regxp validation 202105.18-09.18
    context('rfc', () => {
      cy.get('[data-test=curriculum-user-rfc]').as('rfc')
      cy.get('@rfc').type(chance.string())
      cy.get('.errors > span')
        .as('error')
        .should('exist')
      cy.get('@error').should('contain', 'Formato inválido')
      cy.focused().clear()
      cy.get('@rfc').type('sabm820627le9')
      cy.get('errors > span').should('not.contain', 'Formato inválido')
    })

    context('curp', () => {
      cy.get('[data-test=curriculum-user-curp]').as('curp')
      cy.get('@curp').type(chance.string())
      cy.get('.errors > span')
        .as('error')
        .should('exist')
      cy.get('@error').should('contain', 'Formato inválido')
      cy.focused().blur()
      cy.get('@curp').clear()
      cy.get('@curp').type('BOMP551218MDFRRR01')
      cy.get('@error').should('not.contain', 'Formato inválido')
    })

    context('address', () => {
      cy.get('#residencia')
        .as('address')
        .should('exist')
      // TODO complete me 202105.20-16.00
    })

    context('email', () => {
      cy.get('[data-test=curriculum-user-email]').as('email')
      cy.get('@email').type(chance.string())
      cy.get('.errors > span').should('exist')
      cy.get('.errors > span')
        .should('be.visible')
        .should('contain', 'Dirección de correo electrónico inválida')
      cy.get('@email').type(chance.email())
      cy.get('.error > span').should('not.contain', 'Dirección de correo electrónico inválida')
    })

    context('university', () => {
      cy.get('[data-test=curriculum-user-university]').as('university')
      cy.get('@university').should('exist')
      cy.get('@university')
        .eq(0)
        .select('Universidad Nacional Autónoma de México')
      cy.get('#university-campi').as('campi')
      cy.get('@campi').should('exist')
      cy.get('@campi').should('be.visible')
      cy.get('@campi')
        .eq(0)
        .select('Facultad de Medicina Ciudad Universitaria')
    })
  })
})
