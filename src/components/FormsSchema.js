// import { required } from 'vee-validate/dist/rules'
import { validators } from 'vue-form-generator'

export default {
  data: () => ({
    documents: [
      {
        name: 'Fotografía de diploma',
        required: true,
        points: 0,
        schema: {
          groups: [
            {
              fields: [
                {
                  type: 'image',
                  label: 'Avatar',
                  model: 'avatar',
                  required: true,
                  validator: validators.checkSize,
                },
                {
                  type: 'submit',
                  label: 'Enviar',
                  buttonText: 'Almacenar',
                  onSubmit: 'alert("submited")',
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
  mounted() {},
  methods: {
    async checkSize(value, field, model) {
      const blob = await fetch(model.avatar)
        .then(res => res.blob())
        .then(foo => {
          return foo
        })
      if (blob.size / (1024 * 1024) > 5) return ['Tamaño máximo de archivo 5MB']
      return []
    },
    submit() {
      console.log('submit: ')
      // eslint-disable-next-line no-alert
      alert('submit')
    },
    checkAmount(value) {
      console.log('value :>> ', value)
      // eslint-disable-next-line no-alert
      alert('Filesize')
    },
  },
  created() {
    validators.checkSize = this.checkSize
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
