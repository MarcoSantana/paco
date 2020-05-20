//  _______ _______
//  |  |  | |______
//  |  |  | ______|
// author: mSantana
// createdAt 2020-05-20 16:10
// Stardate: 202005.20 16.10
// fileName: misc/validation.js

/* 
Every error message must begin with 'Este campo es obligatorio / Este campo debe ser XXXXX
*/

import { extend } from 'vee-validate'
import { required, email, numeric, confirmed } from 'vee-validate/dist/rules'

this.$validator.localize('es')

extend('email', {
  ...email,
  message: 'Este campo debe ser un correo electrónico válido',
})

extend('confirmed', {
  ...confirmed,
  message: 'Este campo debe ser confirmado',
})

extend('required', {
  ...required,
  message: 'Este campo es obligatorio',
})

extend('numeric', {
  ...numeric,
  message: 'Este campo debe ser numérico',
})

extend('length', {
  validate(value, { min, max }) {
    const string = value.toString()
    if (string.length > min && string.length < max) {
      return true
    }
    return 'Este campo debe ser de máximo {max} y mínimo {min} caracteres'
  },
  params: ['min', 'max'],
})
