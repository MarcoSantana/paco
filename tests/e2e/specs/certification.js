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
      cy.get('[data-test=document-next-btn]').as('nextButton')

      cy.nextWizardTab('@nextButton')
    })
    // Request place
    context('should show a place (google powered)', () => {
      cy.get('#lugar-de-solicitud')
        .as('request')
        .should('be.visible')
      cy.get('@request')
        .type('infinite loop 1')
        .get('.pac-item', { timeout: 10000 })
        .should('be.visible')
      cy.get('@request').type('{downarrow}')
      cy.get('@request').type('{enter}')
      cy.get('@request').should('have.value', '1 Infinite Loop, Cupertino, CA 95014, EE. UU.')
      cy.nextWizardTab('@nextButton')
    })
    // Request date
    context('should have a request date', () => {
      cy.get('[data-test="request-date"]').as('date')
      cy.get('@date').click()
      cy.get('.vdatetime-popup__title').as('title')
      cy.get('@title').should('contain', 'Fecha de solicitud')
      cy.get('.vdatetime-popup__year', { timeout: 2000 }).as('year')
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
      cy.get(':nth-child(35) > :nth-child(1)', { timeout: 10000 }).click()
      cy.get('.vdatetime-input').should('have.value', '25 de julio de 1982')
    })
    // First name
    context('should verify first name', () => {
      cy.get('[data-test=request-firstName]').should('exist')
      cy.get('[data-test=request-firstName]').as('firstName')
      cy.get('@firstName').type(chance.string({ numeric: true }))
      // FIXME refactor to keep it dry 202106.20-17.03
      cy.get('@firstName')
        .parents('.error')
        .should('exist')
      // cy.get('.errors > span').should('contain', 'Formato inválido')
      cy.focused().clear() // Clear focused input/textarea
      cy.get('@firstName').type(chance.first())
      cy.get('@firstName')
        .parents('.error')
        .should('not.exist')
    })

    // Last Name 1
    context('last name 1', () => {
      cy.get('[data-test=request-lastName1]').as('lastName1')
      cy.get('@lastName1').type(chance.string({ numeric: true }))
      // FIXME refactor to keep it dry 202106.20-17.03
      cy.get('@lastName1')
        .parents('.error')
        .should('exist')
      cy.focused().clear() // Clear focused input/textarea
      cy.get('@lastName1').type(chance.last({ nationality: 'es' }))
      // FIXME refactor to keep it dry 202106.20-17.03
      cy.get('@lastName1')
        .parents('.error')
        .should('not.exist')
    })

    // Last Name 2
    context('last name 2', () => {
      cy.get('[data-test=request-lastName2]').as('lastName2')
      cy.get('@lastName2').type(chance.string())
      // FIXME refactor to keep it dry 202106.20-17.03
      cy.get('@lastName2')
        .parents('.error')
        .should('exist')
      cy.focused().clear() // Clear focused input/textarea
      cy.get('@lastName2').type(chance.last({ nationality: 'es' }))
      // FIXME refactor to keep it dry 202106.20-17.03
      cy.get('@lastName2')
        .parents('.error')
        .should('not.exist')
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
      cy.get('.vdatetime-input').should('have.value', '25 de julio de 1982')
      cy.get('#age').as('age')
      cy.get('@age').should('have.value', '39')

      // Close pop up
      // cy.get('.vdatetime-popup__actions__button--cancel').as('cancelButton')
      // cy.get('@cancelButton').click()
    })
    // Gender
    context('gender', () => {
      cy.get('[data-test="user-gender"]').as('gender')
      cy.get(':nth-child(1) > [data-test=user-gender]').click()
      // cy.get('#sexo-11').check('Hombre')
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
      cy.get('@address').type('calzada de tlalpan 770')
      cy.get('.pac-item', { timeout: 10000 }).should('be.visible')
      cy.get('@address').type('{downarrow}')
      cy.get('@address').type('{enter}')
      cy.get('@address').should(
        'have.value',
        'Calz. de Tlalpan 770, Iztaccihuatl, Benito Juárez, 03520 Ciudad de México, CDMX, México'
      )
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
      cy.nextWizardTab('@nextButton')
    })
    // phone (land line)
    context('landphone', () => {
      cy.get('[data-test="contact-telephone"]')
        .as('phone')
        .should('exist')
      cy.get('@phone').type(chance.string())
      // FIXME refactor to keep it dry 202106.20-17.03
      cy.get('@phone')
        .parents('.error')
        .should('exist')
      cy.focused().clear() // clear focused input/textarea
      cy.get('@phone').type(chance.phone())
      // FIXME refactor to keep it dry 202106.20-17.03
      cy.get('@phone')
        .parents('.error')
        .should('not.exist')
    })
    // Fax
    context('fax', () => {
      cy.get('[data-test="contact-fax"]')
        .as('fax')
        .should('exist')
      cy.get('@fax').type(chance.string())
      // FIXME refactor to keep it dry 202106.20-17.03
      cy.get('@fax')
        .parents('.error')
        .should('exist')
      cy.focused().clear() // clear focused input/textarea
      cy.get('@fax').type(chance.phone())
      // FIXME refactor to keep it dry 202106.20-17.03
      cy.get('@fax')
        .parents('.error')
        .should('not.exist')
    })
    // Cellphone
    context('cellphone', () => {
      cy.get('[data-test="contact-cellphone"]')
        .as('cellphone')
        .should('exist')
      cy.get('@cellphone').type(chance.string())
      // FIXME refactor to keep it dry 202106.20-17.03
      cy.get('@cellphone')
        .parents('.error')
        .should('exist')
      cy.focused().clear() // clear focused input/textarea
      cy.get('@cellphone').type(chance.phone())
      // FIXME refactor to keep it dry 202106.20-17.03
      cy.get('@cellphone')
        .parents('.error')
        .should('not.exist')
    })
    // email
    context('email', () => {
      cy.get('[data-test=contact-email]').as('email')
      cy.get('@email').type(chance.string())
      // FIXME refactor to keep it dry 202106.20-17.03
      cy.get('@email')
        .parents('.error')
        .should('exist')
        .should('contain', 'Dirección de correo electrónico inválida')
      cy.focused().clear() // clear focused input/textarea
      cy.get('@email').type(chance.email())
      cy.get('@email')
        .parents('.error')
        .should('not.exist')
      cy.nextWizardTab('@nextButton')
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
      cy.get('[data-test=postgraduate-hospital]')
        .as('postgraduateHospital')
        .should('exist')
      cy.get('@postgraduateHospital').type(chance.sentence())
      cy.focused().clear()
      cy.get('@postgraduateHospital').type('Hospital General Tic')
      cy.get('@postgraduateHospital')
        .siblings('.results')
        .as('postgraduateHospital.list')
      cy.get('@postgraduateHospital.list')
        .should('be.visible')
        .should('contain', 'Hospital General Ticomán')
        .click()
      cy.get('@postgraduateHospital').should('have.value', 'Hospital General Ticomán')
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
      cy.get('.vdatetime-input').should('have.value', '25 de julio de 1982')

      // Close pop up
      // cy.get('.vdatetime-popup__actions__button--cancel').as('cancelButton')
      // cy.get('@cancelButton').click()
    })
    // Studied specialty
    context('specialty', () => {
      cy.get('[data-test=postgraduate-specialty]')
        .as('specialty')
        .should('exist')
      cy.get('@specialty')
        .eq(0)
        .select('Urgencias médico quirúrgicas')
      cy.get('@specialty').should('have.value', 'Urgencias médico quirúrgicas')
    })
    // previous exam
    context('previousExam', () => {
      cy.get('[data-test=request-previousExam]').as('previousExam')
      cy.get('@previousExam').check()
    })
    // license
    context('license', () => {
      cy.get('[data-test=request-license]').as('license')
      cy.get('@license').type(chance.string({ numeric: true, length: 5 }))
      cy.get('@license')
        .parents('.error')
        .should('exist')
      cy.focused().clear()
      cy.get('@license').type(chance.string({ numeric: true, length: 9 }))
      // FIXME refactor to keep it dry 202106.20-17.03
      cy.get('@license')
        .parents('.error')
        .should('exist')
      cy.focused().clear()
      cy.get('@license').type(chance.string({ numeric: true, length: 7 }))
      // FIXME refactor to keep it dry 202106.20-17.03
      cy.get('@license')
        .parents('.error')
        .should('not.exist')
      cy.nextWizardTab('@nextButton')
    })
    // professionalExercise

    context('hospital', () => {
      cy.get('[data-test=request-professionalExercise-hospital]')
        .as('professional.Hospital')
        .should('exist')
      cy.get('@professional.Hospital').type(chance.sentence())
      cy.focused().clear()
      cy.get('@professional.Hospital').type('Hospital General Tic')
      cy.get('@professional.Hospital')
        .siblings('.results')
        .as('professional.Hospital.list')
      cy.get('@professional.Hospital.list')
        .should('be.visible')
        .should('contain', 'Hospital General Ticomán')
        .click()
      cy.get('@professional.Hospital').should('have.value', 'Hospital General Ticomán')
    })

    context('workplace', () => {
      cy.get('#direccin-del-trabajo').as('workplace')
      cy.get('@workplace').type('infinite loop 1')
      cy.get('.pac-item', { timeout: 10000 }).should('be.visible')
      cy.get('@workplace').type('{downarrow}')
      cy.get('@workplace').type('{enter}')
      cy.get('@workplace').should('have.value', '1 Infinite Loop, Cupertino, CA 95014, EE. UU.')
    })

    context('job', () => {
      // chance.profession({rank: true})
      cy.get('[data-test="request-professionalExercise-charge"]').as('job')
      cy.get('@job').type(chance.profession({ rank: true }))
      cy.nextWizardTab('@nextButton')
    })

    context('voucher', () => {
      cy.get('[data-test=request-voucher]')
        .as('voucher')
        .should('exist')
    })
    context('diploma', () => {
      cy.get('[data-test=request-uploadDegreeDiploma]')
        .as('uploadDiploma')
        .should('exist')
    })
    context('license', () => {
      cy.get('[data-test=request-uploadLicense]')
        .as('uploadLicense')
        .should('exist')
    })
    context('enarm', () => {
      cy.get('[data-test=request-uploadEnarm]')
        .as('uploadEnarm')
        .should('exist')
    })
    context('pediatricResidence', () => {
      cy.get('[data-test=request-uploadPediatricResidence]')
        .as('uploadResidence')
        .should('exist')
    })
  })
})
