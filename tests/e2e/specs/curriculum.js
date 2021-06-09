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
    // DOB
    context('dob', () => {
      cy.get('[data-test=curriculum-user-dob]').as('dob')
      cy.get('@dob').should('exist')
      cy.get('@dob').click()
      cy.get('.vdatetime-popup').as('popup')
      cy.get('.vdatetime-popup__title').as('title')
      cy.get('@title').should('contain', 'Fecha de nacimiento')
      cy.get('.vdatetime-popup__year').as('year')
      cy.get('@year').click()
      cy.get('.vdatetime-year-picker__list > :nth-child(62)')
        .should('contain', '1982')
        .click()
      cy.get('.vdatetime-popup__date')
        .as('date')
        .click()
      cy.get('.vdatetime-month-picker')
        .should('be.visible')
        .should('contain', 'Junio')
        .click()
      cy.get('.vdatetime-calendar__month')
        .should('be.visible')
        .should('contain', '27')
      cy.get(':nth-child(35) > :nth-child(1)').click()
      cy.get('.vdatetime-input').should('have.value', '27 de junio de 1982')
      cy.get('#age').as('age')
      cy.get('@age').should('have.value', '38')

      // Close pop up
      // cy.get('.vdatetime-popup__actions__button--cancel').as('cancelButton')
      // cy.get('@cancelButton').click()
    })

    // RFC
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
      cy.get('#domicilio-permanente')
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

    // Garduation date
    context('graduationDate', () => {
      cy.get('[data-test=curriculum-user-graduationDate]').as('graduationDate')
      cy.get('@graduationDate').should('exist')
      cy.get('@graduationDate').click()
      cy.get('.vdatetime-popup').as('popup')
      cy.get('.vdatetime-popup__title').as('title')
      cy.get('@title').should('contain', 'Fecha de expedición del título')
      cy.get('.vdatetime-popup__year').as('year')
      cy.get('@year').click()
      cy.get('.vdatetime-year-picker__list > :nth-child(100)')
        .should('contain', '2020')
        .click()
      cy.get('.vdatetime-popup__date').as('date').click()
      cy.get('.vdatetime-month-picker__list > :nth-child(1)').click()
      cy.get(':nth-child(10) > :nth-child(1) > span').click()
      cy.get('[data-test=curriculum-user-graduationDate] > .vdatetime-input').should('have.value', '1 de enero de 2020')
    })

    context('hospital', () => {
      cy.get('[data-test=curriculum-user-hospital]').as('hospital')
      cy.get('@hospital').should('exist')
      cy.get('@hospital').type('Hospital General Tic')
      cy.get('[data-test=curriculum-user-hospital-list]').as('list')
      cy.get('@list')
        .should('be.visible')
        .should('contain', 'Hospital General Ticomán')
      cy.get('.result').should('contain', 'Hospital General Ticomán').click()
      cy.get('@hospital').should('have.value', 'Hospital General Ticomán' )
    })
  })
})
