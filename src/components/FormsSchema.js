// import { required } from 'vee-validate/dist/rules'
import { validators } from 'vue-form-generator'

export default {
  data: () => ({
    documents: [
      {
        name: 'Curriculum Vitae',
        required: true,
        point: 0,
        schema: {
          groups: [
            // User details
            {
              legend: 'Datos personales',
              fields: [
                // Names
                {
                  type: 'input',
                  inputType: 'text',
                  label: 'Nombre (s)',
                  model: 'user.firstName',
                  attributes: {
                    input: { 'data-test': 'curriculum-user-firstName' },
                  },
                  readonly: false,
                  disabled: false,
                  styleClasses: 'document-form',
                  validator: ['required', 'regexp'],
                  pattern: "^[ a-zA-ZáéíóúÁÉÍÓÚÄËÏÖÜäëïöü'-]+$",
                },
                {
                  type: 'input',
                  inputType: 'text',
                  label: 'Apellido paterno',
                  model: 'user.lastName1',
                  attributes: {
                    input: { 'data-test': 'curriculum-user-lastName1' },
                  },
                  readonly: false,
                  disabled: false,
                  styleClasses: 'document-form',
                  validator: ['regexp', 'required'],
                  pattern: "^[ a-zA-ZáéíóúÁÉÍÓÚÄËÏÖÜäëïöü'-]+$",
                },
                {
                  type: 'input',
                  inputType: 'text',
                  label: 'Apellido Materno',
                  required: false,
                  model: 'user.lastName2',
                  attributes: {
                    input: { 'data-test': 'curriculum-user-lastName2' },
                  },
                  visibility: 'true',
                  styleClasses: 'document-form',
                  validator: ['regexp'],
                  pattern: "^[ a-zA-ZáéíóúÁÉÍÓÚÄËÏÖÜäëïöü'-]+$",
                },
                {
                  type: 'input',
                  inputType: 'text',
                  label: 'RFC',
                  hint: 'Registro federal de contribuyentes',
                  model: 'user.rfc',
                  attributes: {
                    input: { 'data-test': 'curriculum-user-rfc' },
                  },
                  visibility: 'true',
                  styleClasses: 'document-form',
                  validator: ['required', 'regexp'],
                  pattern: '^[a-zA-Z]{4}[0-9]{6}[A-Za-z0-9_]{3}$',
                },
                {
                  type: 'input',
                  inputType: 'text',
                  label: 'CURP',
                  hint: 'Clave única de registro de población',
                  model: 'user.curp',
                  attributes: {
                    input: { 'data-test': 'curriculum-user-curp' },
                  },
                  visibility: 'true',
                  styleClasses: 'document-form',
                  validator: ['required', 'regexp'],
                  pattern:
                    '^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$',
                },
                // Address
                {
                  type: 'googleAddress',
                  label: 'Dirección actual',
                  styleClasses: 'document-form',
                  placeholder: 'Dirección',
                  model: 'user-googleAddress',
                  attributes: {
                    input: { 'data-test': 'curriculum-user-googleAddress' },
                  },
                },
              ],
            },
          ],
        },
      },
      {
        name: 'Credencial INE',
        required: true,
        point: 0,
        schema: {
          groups: [
            {
              legend: 'Detalles de la identificación',
              fields: [
                {
                  type: 'input',
                  inputType: 'text',
                  label: 'Registro de elector',
                  model: 'ine.registry',
                  readonly: false,
                  disabled: false,
                  styleClasses: 'document-form',
                  validator: ['regexp', 'required'],
                  pattern:
                    '^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$',
                },
                {
                  type: 'upload',
                  inputType: 'file',
                  label: 'Click para cargar el frente del documento',
                  required: true,
                  model: document.back,
                  styleClasses: 'file-upload',
                  hint: 'Puede ser un archivo de imagen o un PDF',
                },
              ],
            },
          ],
        },
      },
      {
        name: 'Diploma de curso',
        required: false,
        points: 5,
      },
      {
        name: 'Acta de nacimiento',
        required: true,
        points: 0,
        schema: {
          groups: [
            {
              fields: [
                {
                  type: 'pdf',
                  label: 'Cargar documento',
                  hideInput: true,
                  browse: true,
                  preview: true,
                  model: 'document.front',
                },
              ],
            },
          ],
        },
      },
      {
        name: 'Cédula profesional',
        required: true,
        points: 0,
      },
    ],
  }),
  created() {
    const res = validators.resources
    res.textTooSmall = 'No son suficientes caracteres'
    res.fieldIsRequired = 'Este campo en requerido'
    res.dateIsEarly = 'Esta fecha es muy pronto. Actual: {0}, Mínimo: {1}'
    res.dateIsLate = 'Esta fecha es muy tarde. Actual: {0}, Máximo: {1}'
    res.fieldIsRequired = 'Este campo en requerido'
    res.invalidCard = 'Tarjeta inválida'
    res.invalidCardNumber = 'Número de tarjeta inválido'
    res.invalidDate = 'Fecha inválida'
    res.invalidEmail = 'Dirección de correo electrónico inválida'
    res.invalidFormat = 'Formato inválido'
    res.invalidInteger = 'El valor no es un número entero'
    res.invalidNumber = 'Número inválido'
    res.invalidTextContainNumber = 'Texto inválido. No puede contener números ni caracteres especiales'
    res.invalidTextContainSpec = 'Texto inválido. No puede contener caracteres especiales'
    res.invalidURL = 'URL inválido'
    res.numberTooBig = 'El número es muy grande. Máximo: {0}'
    res.numberTooSmall = ' El número es muy pequeño. Mínimo: {0}'
    res.selectMaxItems = 'Select maximum {0} items!'
    res.selectMinItems = 'Select minimum {0} items!'
    res.textTooBig = 'The length of text is too big! Current: {0}, Maximum: {1}'
    res.textTooSmall = 'No son suficientes caracteres'
    res.thisNotArray = 'No es un array'
    res.thisNotText = 'No es texto'
  },
}
