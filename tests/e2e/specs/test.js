//  _______ _______
//  |  |  | |______
//  |  |  | ______|
// author: mSantana
// createdAt 2020-05-05 10:37
// fileName: specs/test.js

describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/login')
    cy.contains('h1', 'Login')
  })
})
