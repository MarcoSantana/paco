// / <reference types="cypress"> />
/*
 author 🥋: mSantana
 directory 📁: ~/development/paco/paco/tests/e2e/specs
 filename 📄: curriculum.js
 stardate 🚀: 202105.17-19.45
 */
import Chance from 'chance'
// import { DateTime } from 'luxon'

const chance = new Chance()

describe('Curriculum', () => {
  beforeEach(() => {
    cy.logout()
    cy.visit('/login')
    cy.login()
  })

  it('should create a valid certification request', () => {
    context('should have the proper title', () => {
      cy.wait(2000) // wait for 2 seconds
      cy.visit('/request')
      cy.get('.navbar').as('navbar')
      cy.get('@navbar').should('contain', 'Solicitud de examen')
      cy.get('[data-test=navbar-request-link]').as('request-link')
      cy.get('@request-link').click()
      cy.get('.request-page-title').should('contain', 'Solicitud de certificación')
    })
    // Request place
    context('should show a place (google powered)', () => {
      cy.get('#lugar-de-solicitud')
    })
    // Request date
    context('should have a request date', () => {
      cy.get('[data-test="request-date"]').as('date')
      cy.get('@date').click()
      cy.get('.vdatetime-popup__title').as('title')
      cy.get('@title').should('contain', 'Fecha de solicitud')
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
    })
    // First name
    context('should verify first name', () => {
      cy.get('[data-test=request-firstName]').should('exist')
      cy.get('[data-test=request-firstName]').as('firstName')
      cy.get('@firstName').type(chance.string({ alpha: true }))
      cy.get('.errors > span').should('contain', 'Formato inválido')
      cy.focused().clear() // Clear focused input/textarea
      cy.get('.errors > span').should('not.contain', 'Formato inválido')
      cy.get('@firstName').type('Marco Antonio')
      cy.get('.errors > span').should('not.contain', 'Formato inválido')
    })

    // Last Name 1
    context('last name 1', () => {
      cy.get('[data-test=request-lastName1]').as('lastName1')
      cy.get('@lastName1').type(chance.string())
      cy.get('.errors > span').should('contain', 'Formato inválido')
      cy.focused().clear() // Clear focused input/textarea
      cy.get('.errors > span').should('not.contain', 'Formato inválido')
      cy.get('@lastName1').type('Santana')
      cy.get('.errors > span').should('not.contain', 'Formato inválido')
    })

    // Last Name 2
    context('last name 2', () => {
      cy.get('[data-test=request-lastName2]').as('lastName2')
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
    // Gender
    context('gender', () => {
      cy.get('[data-test="user-gender"]').as('gender')
      cy.get('.radio-list > :nth-child(1)').click()
    })

    // RFC
    context('rfc', () => {
      cy.get('[data-test=user-rfc]').as('rfc')
      cy.get('@rfc').type(chance.string())
      cy.get('.errors > span')
        .as('error')
        .should('exist')
      cy.get('@error').should('contain', 'Formato inválido')
      cy.focused().clear()
      cy.get('@rfc').type('sabm820627le9')
      cy.get('errors > span').should('not.contain', 'Formato inválido')
    })

    // CURP
    context('curp', () => {
      cy.get('[data-test=user-curp]').as('curp')
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

    // permanent adress
    context('address', () => {
      cy.get('#domicilio-permanente')
        .as('address')
        .should('exist')
      cy.get('@address').type('calzada de tla')
      cy.get('.pac-item', { timeout: 10000 }).should('be.visible')
      cy.get('@address').type('{downarrow}')
      cy.get('@address').type('{enter}')
      cy.get('@address').should('have.value', 'Calz. de Tlalpan, Portales Nte, Ciudad de México, CDMX, México')
    })

    // user nacionality
    context('nationality', () => {
      cy.get('#pas-de-nacimiento').as('nationality')
      cy.get('@nationality').type('Méx')
      cy.get('.pac-item', { timeout: 10000 }).should('be.visible')
      cy.get('@nationality').type('{downarrow}')
      cy.get('@nationality').type('{downarrow}')
      cy.get('@nationality').type('{enter}')
      cy.get('@nationality').should('have.value', 'México')
    })
    // phone (land line)
    context('landphone', () => {
      cy.get('[data-test="contact-telephone"]')
        .as('phone')
        .should('exist')
      cy.get('@phone').type(chance.string())
      cy.get('.errors > span').should('exist')
      cy.focused().clear() // clear focused input/textarea
      cy.get('@phone').type(chance.phone())
      cy.get('.errors > span').should('not.exist')
    })
    // Fax
    context('fax', () => {
      cy.get('[data-test="contact-fax"]')
        .as('fax')
        .should('exist')
      cy.get('@fax').type(chance.string())
      cy.get('.errors > span').should('exist')
      cy.focused().clear() // clear focused input/textarea
      cy.get('@fax').type(chance.phone())
      cy.get('.errors > span').should('not.exist')
    })
    // Cellphone
    context('cellphone', () => {
      cy.get('[data-test="contact-cellphone"]')
        .as('cellphone')
        .should('exist')
      cy.get('@cellphone').type(chance.string())
      cy.get('.errors > span').should('exist')
      cy.focused().clear() // clear focused input/textarea
      cy.get('@cellphone').type(chance.phone())
      cy.get('.errors > span').should('not.exist')
    })
    // email
    context('email', () => {
      cy.get('[data-test=contact-email]').as('email')
      cy.get('@email').type(chance.string())
      cy.get('.errors > span').should('exist')
      cy.get('.errors > span')
        .should('be.visible')
        .should('contain', 'Dirección de correo electrónico inválida')
      cy.get('@email').type(chance.email())
      cy.get('.error > span').should('not.contain', 'Dirección de correo electrónico inválida')
    })

    //   // // Garduation date
    //   // context('graduationDate', () => {
    //   //   cy.get('[data-test=curriculum-user-graduationDate]').as('graduationDate')
    //   //   cy.get('@graduationDate').should('exist')
    //   //   cy.get('@graduationDate').click()
    //   //   cy.get('.vdatetime-popup').as('popup')
    //   //   cy.get('.vdatetime-popup__title').as('title')
    //   //   cy.get('@title').should('contain', 'Fecha de expedición del título')
    //   //   cy.get('.vdatetime-popup__year').as('year')
    //   //   cy.get('@year').click()
    //   //   cy.get('.vdatetime-year-picker__list > :nth-child(100)')
    //   //     .should('contain', '2020')
    //   //     .click()
    //   //   cy.get('.vdatetime-popup__date')
    //   //     .as('date')
    //   //     .click()
    //   //   cy.get('.vdatetime-month-picker__list > :nth-child(1)').click()
    //   //   cy.get(':nth-child(10) > :nth-child(1) > span').click()
    //   //   cy.get('[data-test=curriculum-user-graduationDate] > .vdatetime-input').should('have.value', '1 de enero de 2020')
    //   // })

    //   // // Degree emission place
    //   // context('graduationPlace', () => {
    //   //   cy.get('#lugar-de-expedicin-del-ttulo')
    //   //     .as('degreeAddress')
    //   //     .should('exist')
    //   //   // TODO complete me 202105.20-16.00
    //   // })

    // Postgraduate studies
    context('hospital', () => {
      cy.get('[data-test=postgraduate-hospital]').as('hospital')
      cy.get('@hospital').should('exist')
      cy.get('@hospital').type('Hospital General Tic')
      cy.get('[data-test=hospital-list]').as('list')
      cy.get('@list')
        .should('be.visible')
        .should('contain', 'Hospital General Ticomán')
      cy.get('.result')
        .should('contain', 'Hospital General Ticomán')
        .click()
      cy.get('@hospital').should('have.value', 'Hospital General Ticomán')
    })
    // Endorser
    context('university', () => {
      cy.get('[data-test=postgraduate-university]').as('university')
      cy.get('@university').should('exist')
      cy.get('@university')
        .eq(0)
        .select('Universidad Nacional Autónoma de México')
      cy.get('@university').should('have.value', 'WZZUhetvC1xm6vNZ2nzV')
    })
    // Graduation date
    context('graduationDate', () => {
      cy.get('[data-test=postgraduate-graduationDate]').as('graduationDate')
      cy.get('@graduationDate').should('exist')
      cy.get('@graduationDate').click()
      cy.get('.vdatetime-popup').as('popup')
      cy.get('.vdatetime-popup__title').as('title')
      cy.get('@title').should('contain', 'Fecha de graduación')
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

      // Close pop up
      // cy.get('.vdatetime-popup__actions__button--cancel').as('cancelButton')
      // cy.get('@cancelButton').click()
    })
    // Studied specialty
    context('specialty', () => {
      cy.get('[data-test=postgraduate-specialty]')
        .as('specialty')
        .should('exist')
      cy.get('@specialty').type(chance.integer())
      cy.get('.errors > span').should('exist')
      cy.get('.errors > span').should('be.visible')
      cy.get('@specialty').type(chance.animal())
    })
    // previous exam
    context('previousExam', () => {
      cy.get('[data-test=previousExam]').as('previousExam')
      cy.get('@previousExam').check()
    })

    //   /**
    //      |--------------------------------------------------
    //      |Postgraduate section until I find a better way to
    //      |test the clicks on the datepicker it will be
    //      |commented out
    //      |--------------------------------------------------
    //   */
    //   // context('postgraduate', () => {
    //   //   cy.get('#postgraduatePeriod-start').as('postgraduateStart')
    //   //   cy.get('@postgraduateStart').should('exist')
    //   //   cy.get('#postgraduatePeriod-end').as('postgraduateEnd')
    //   //   cy.get('@postgraduateEnd').should('exist')
    //   //   // cy.get('@postgraduateStart').click()
    //   //   // cy.get('.vdatetime-popup').as('popup')
    //   //   // cy.get('.vdatetime-popup__title').as('title')
    //   //   // cy.get('@title').should('contain', 'Inicio de Estudios de posgrado en pediatría')
    //   //   // cy.get('.vdatetime-popup__year').as('year')
    //   //   // cy.get('@year').click()
    //   //   // cy.get('.vdatetime-year-picker__list > :nth-child(97)').click()
    //   //   // cy.get('.vdatetime-popup__date')
    //   //   //   .as('date')
    //   //   //   .click()
    //   //   // cy.get('.vdatetime-month-picker__list > :nth-child(2)').click()
    //   //   // cy.get('.vdatetime-popup__actions__button--confirm').click()
    //   //   // cy.get('@postgraduateStart').should('have.value', '11 de febrero de 2017')
    //   //   // // End
    //   //   // cy.get('@postgraduateEnd').click()
    //   //   // cy.get('.vdatetime-popup').as('popup')
    //   //   // cy.get('.vdatetime-popup__title').as('title')
    //   //   // cy.get('@title').should('contain', 'Fin de Estudios de posgrado en pediatría')
    //   //   // cy.get('.vdatetime-popup__year').as('year')
    //   //   // cy.get('@year').click()
    //   //   // cy.get('.vdatetime-year-picker__list > :nth-child(101)').click()
    //   //   // cy.get('.vdatetime-popup__date')
    //   //   //   .as('date')
    //   //   //   .click()
    //   //   // cy.get('.vdatetime-month-picker__list > :nth-child(5)').click()
    //   //   // cy.get('.vdatetime-popup__actions__button--confirm').click()
    //   //   // // Compare dates
    //   //   // let startDate = null
    //   //   // let endDate = null
    //   //   // cy.get('@postgraduateStart')
    //   //   //   .invoke('val')
    //   //   //   .should(value => {
    //   //   //     startDate = DateTime.fromISO(value)
    //   //   //     console.log('startDate :>> ', startDate.ts)
    //   //   //   })
    //   //   // cy.get('@postgraduateEnd')
    //   //   //   .invoke('val')
    //   //   //   .should(value => {
    //   //   //     endDate = DateTime.fromISO(value)
    //   //   //     console.log('endDate :>> ', endDate.ts)
    //   //   //   })
    //   //   //   .then(() => {
    //   //   //     expect(startDate.ts).to.be.lessThan(endDate.ts)
    //   //   //   })
    //   //   // console.log('startDate :>> ', startDate)
    //   //   // console.log('endDate :>> ', endDate)
    //   //   cy.get('[data-test=curriculum-user-postgraduatePlace]').as('postgraduatePlace')
    //   //   cy.get('@postgraduatePlace').should('exist')
    //   // })
  })
})
