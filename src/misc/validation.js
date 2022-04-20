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
  message: 'El campo es obligatorio',
})

extend('numeric', {
  ...numeric,
  // message: 'Este campo debe ser numérico',
})

extend('length', {
  params: ['min', 'max'],
  validate(value, { min, max }) {
    const string = value.toString()
    if (string.length >= min && string.length <= max) {
      return true
    }
    return 'El campo debe tener máximo {max} y mínimo {min} caracteres'
  },
})

extend('strong_password', {
  validate(value) {
    const string = value.toString()
    const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})')
    if (strongRegex.test(string)) {
      return true
    }
    return 'La contraseña debe contener al menos: una letra mayúscula, una letra minúscula y un número.'
  },
})

extend('curp_regex', {
  validate(value) {
    debugger
    return RegExp(
      '^[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$'
    ).test(value.toString)
      ? true
      : 'No es un formato de CURP válido'
  },
})

extend('cellphone', {
  validate(value) {
    // eslint-disable-next-line
    return RegExp('(52)?1?(([2-9][1-9][1-8]\\d{7})|([2-9][1-9][1-9][1-8]\\d{6}))').test(value)
      ? true
      : 'No es un formato válido de teléfono'
  },
})
