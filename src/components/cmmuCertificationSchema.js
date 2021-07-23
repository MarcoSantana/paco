// import { isNil } from 'lodash'
import { validators } from 'vue-form-generator'

export default {
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
    onValidated(isValid, errors) {
      // console.log('Validation result: ', isValid, ', Errors:', errors)
      if (errors.length >= 0) {
        console.log('isValid :>> ', isValid)
        console.log('errors :>> ', errors)
        this.model.errors = errors
      }
    },
  },
  data: () => ({
    validated: null,
    isValid: false,
    that: this,
    schema: {
      groups: [
        {
          legend: 'Solicitud',
          fields: [
            // Lugar de solicitud
            {
              type: 'googleAddress',
              label: 'Lugar de solicitud',
              hint: 'CDMX, Mty, Oax, Gdl',
              model: 'request.address',
              attributes: {
                input: { 'data-test': 'request-googleAddress' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
              required: true,
              validator: validators.required,
            },
            // Fecha de solicitud
            {
              type: 'date',
              label: 'Fecha de solicitud',
              model: 'request.date',
              title: 'Fecha de solicitud',
              age: false,
              attributes: {
                input: { 'data-test': 'request-date' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
              required: true,
              // TODO Make the date fixed to today 202107.18-11.31
            },
          ],
        },
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
                input: { 'data-test': 'request-firstName' },
              },
              readonly: false,
              disabled: false,
              styleClasses: 'document-form',
              required: true,
              validator: ['regexp'],
              pattern: "^[ a-zA-ZáéíóúÁÉÍÓÚÄËÏÖÜäëïöü'-]+$",
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Apellido paterno',
              model: 'user.lastName1',
              attributes: {
                input: { 'data-test': 'request-lastName1' },
              },
              readonly: false,
              disabled: false,
              styleClasses: 'document-form',
              required: true,
              validator: ['regexp'],
              pattern: "^[ a-zA-ZáéíóúÁÉÍÓÚÄËÏÖÜäëïöü'-]+$",
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Apellido Materno',
              required: false,
              model: 'user.lastName2',
              attributes: {
                input: { 'data-test': 'request-lastName2' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
              validator: ['regexp'],
              pattern: "^[ a-zA-ZáéíóúÁÉÍÓÚÄËÏÖÜäëïöü'-]+$",
            },
            // DOB
            {
              type: 'date',
              label: 'Fecha de nacimiento',
              model: 'user.dob',
              title: 'Fecha de nacimiento',
              age: true,
              attributes: {
                input: { 'data-test': 'curriculum-user-dob' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
              required: true,
            },
            {
              type: 'radios',
              label: 'Sexo',
              model: 'user.gender',
              attributes: {
                input: { 'data-test': 'user-gender' },
              },
              values: ['Hombre', 'Mujer'],
              styleClasses: 'document-form',
              required: true,
              validator: validators.required,
            },
            // RFC
            {
              type: 'input',
              inputType: 'text',
              label: 'RFC',
              hint: 'Registro federal de contribuyentes',
              model: 'user.rfc',
              attributes: {
                input: { 'data-test': 'user-rfc' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
              required: true,
              validator: ['regexp'],
              pattern: '^[a-zA-Z]{4}[0-9]{6}[A-Za-z0-9_]{3}$',
            },
            // CURP
            {
              type: 'input',
              inputType: 'text',
              label: 'CURP',
              hint: 'Clave única de registro de población',
              model: 'user.curp',
              attributes: {
                input: { 'data-test': 'user-curp' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
              required: true,
              validator: ['regexp'],
              pattern:
                '^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$',
            },
            // Address
            {
              type: 'googleAddress',
              label: 'Domicilio permanente',
              hint: 'Domicilio actual',
              placeholder: 'Busque su dirección',
              model: 'user.address',
              attributes: {
                input: { 'data-test': 'user-permanent-address' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
              // onPlaceChanged: (value, place, rawPlace, model, schema) => {
              //   console.log('value :>> ', value)
              //   console.log('place :>> ', place)
              //   console.log('rawPlace :>> ', rawPlace)
              //   console.log('model :>> ', model)
              //   console.log('schema :>> ', schema)
              // },
              required: true,
              validator: validators.required,
            },
            // User nacionality
            {
              type: 'googleAddress',
              label: 'País de nacimiento',
              hint: 'Escriba el nombre su país de nacimiento',
              placeholder: 'Ej. México, Cuba, Estados Unidos',
              model: 'user.nacionality',
              attributes: {
                input: { 'data-test': 'curriculum-user-googleNacionality' },
              },
              required: true,
              validator: validators.required,
            },
          ],
        },
        // Contact
        {
          legend: 'Datos de contacto',
          fields: [
            // Telephone
            {
              type: 'input',
              inputType: 'text',
              label: 'Teléfono con clave de larga distancia',
              model: 'user.contact.telephone',
              attributes: {
                input: { 'data-test': 'contact-telephone' },
              },
              maxlength: 50,
              placeholder:
                'Ej. (123) 456-7890 +(123) 456-7890 +(123)-456-7890 +(123) - 456-7890 +(123) - 456-78-90 123-456-7890 1234567890 +31636363634 075-63546725',
              required: true,
              validator: ['regexp'],
              // eslint-disable-next-line
              pattern: '^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\ /0-9]*$',
            },
            // Fax
            {
              type: 'input',
              inputType: 'text',
              label: 'Fax con clave de larga distancia',
              model: 'user.contact.fax',
              attributes: {
                input: { 'data-test': 'contact-fax' },
              },
              maxlength: 50,
              placeholder:
                'Ej. (123) 456-7890 +(123) 456-7890 +(123)-456-7890 +(123) - 456-7890 +(123) - 456-78-90 123-456-7890 1234567890 +31636363634 075-63546725',
              required: true,
              validator: ['regexp'],
              // eslint-disable-next-line
              pattern: '^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\ /0-9]*$',
            },
            // Celphone
            {
              type: 'input',
              inputType: 'text',
              label: 'Teléfono celular',
              model: 'user.contact.cellphone',
              attributes: {
                input: { 'data-test': 'contact-cellphone' },
              },
              maxlength: 50,
              placeholder:
                'Ej. (123) 456-7890 +(123) 456-7890 +(123)-456-7890 +(123) - 456-7890 +(123) - 456-78-90 123-456-7890 1234567890 +31636363634 075-63546725',
              required: true,
              validator: ['regexp'],
              // eslint-disable-next-line
              pattern: '^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\ /0-9]*$',
            },
            // email
            {
              type: 'input',
              inputType: 'user.email',
              label: 'Correo electrónico',
              hint: 'Una dirección de correo válida',
              model: 'user.contact.email',
              attributes: {
                input: { 'data-test': 'contact-email' },
              },
              styleClasses: 'document-form',
              visibility: 'true',
              required: true,
              validator: ['email'],
            },
          ],
        },
        // Postgraduate
        {
          legend: 'Estudios',
          fields: [
            // Hospital (postgraduate)
            {
              type: 'hospital',
              label: 'Hospital donde realizó la residencia',
              hint: 'Puede seleccionar uno de la lista',
              model: 'request.postgraduate.hospital',
              attributes: {
                input: { 'data-test': 'postgraduate-hospital' },
              },
              required: true,
            },
            //         // university
            {
              type: 'university',
              id: 'college',
              label: 'Institución encargada del programa académico',
              hint: 'Universidad',
              model: 'request.postgraduate.college',
              attributes: {
                input: { 'data-test': 'postgraduate-university' },
              },
              styleClasses: 'document-form',
              visibility: 'true',
              campus: false,
              required: true,
              validator: validators.required,
            },
            // Graduation year
            {
              type: 'date',
              label: 'Fecha de graduación',
              model: 'request.postgraduate.graduationDate',
              title: 'Fecha de graduación',
              age: false,
              attributes: {
                input: { 'data-test': 'postgraduate-graduationDate' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
              required: true,
            },
            // Specialty
            {
              type: 'select',
              label: 'Especialidad realizada',
              model: 'request.postgraduate.specialty',
              attributes: {
                input: { 'data-test': 'postgraduate-specialty' },
              },
              values: ['Urgencias médico quirúrgicas', 'Medicina de urgencias', 'Urgencias Pediatricas'],
              noneSelectedText: 'Seleccione una especialidad',
              validator: validators.required,
              required: true,
            },
            // Previous exam
            {
              type: 'radios',
              label: '¿Ha realizado previamente el examen?',
              model: 'request.previousExam',
              values: ['Si', 'No'],
              attributes: {
                input: { 'data-test': 'request-previousExam' },
              },
              required: true,
              validator: validators.required,
            },
            // professional license
            {
              type: 'input',
              inputType: 'text',
              label: 'Cédula profesional',
              model: 'request.postgraduate.license',
              attributes: {
                input: { 'data-test': 'request-license' },
              },
              required: true,
              validator: ['regexp'],
              pattern: '^[0-9]{7}([0-9]{8})?$',
            },
          ],
        },
        // Professional exercise
        {
          legend: 'Ejercicio profesional actual',
          fields: [
            {
              type: 'hospital',
              label: 'Hospital donde labora',
              model: 'request.professionalExercise.hospital',
              attributes: {
                input: { 'data-test': 'request-professionalExercise-hospital' },
              },
              hint: 'Ej. Consultorio privado, Hospital General No. 450, Durango',
              required: true,
            },
            {
              type: 'googleAddress',
              label: 'Dirección del trabajo',
              placeholder: 'Dirección',
              model: 'request.professionalExercise.location',
              attributes: {
                input: { 'data-test': 'request-professionalExercise-location' },
              },
              required: true,
              validator: validators.required,
            },
            // Charge
            {
              type: 'input',
              inputType: 'text',
              label: 'Cargo',
              model: 'request.professionalExercise.charge',
              attributes: {
                input: { 'data-test': 'request-professionalExercise-charge' },
              },
              maxlength: 50,
              placeholder: 'Describa brevemente',
              required: true,
              validator: validators.required,
            },
          ],
        },
        // Payment
        {
          legend: 'Carga de documentos',
          fields: [
            // Payment voucher
            {
              type: 'pdf',
              label: 'Cargar comprobante de pago',
              hideInput: true,
              browse: true,
              preview: true,
              model: 'upload.voucher',
              attributes: {
                input: { 'data-test': 'request-voucher' },
              },
              required: false,
              // validator: ['required'],
            },
            // Diploma
            {
              type: 'pdf',
              label: 'Copia del título de la licenciatura en medicina.',
              hideInput: true,
              browse: true,
              preview: true,
              model: 'upload.degreeDiploma',
              attributes: {
                input: { 'data-test': 'request-uploadDegreeDiploma' },
              },
              required: false,
              // validator: ['required'],
            },
            // License
            {
              type: 'pdf',
              label: 'Copia de la cédula profesional de la licenciatura en medicina.',
              hideInput: true,
              browse: true,
              preview: true,
              model: 'upload.license',
              attributes: {
                input: { 'data-test': 'request-uploadLicense' },
              },
              required: false,
              // validator: ['required'],
            },
            // ENARM
            {
              type: 'pdf',
              label: 'Copia de la constancia de haber efectuado y aprobado el ENARM',
              hint:
                'Examen Nacional de Aspirantes a Residencias Médicas (ENARM), realizado por la Comisión Interinstitucional para la Formación de Recursos Humanos para la Salud (CIFRHS)',
              hideInput: true,
              browse: true,
              preview: true,
              model: 'upload.enarm',
              attributes: {
                input: { 'data-test': 'request-uploadEnarm' },
              },
              required: false,
              // validator: ['required'],
            },
            // constancia de haber terminado satisfactoriamente una residencia progresiva hospitalaria de por lo menos 2 años
            {
              type: 'pdf',
              label: 'Constancia de residencia progresiva hospitalaria',
              hint:
                'Constancia de haber terminado satisfactoriamente una residencia progresiva hospitalaria de por lo menos 2 años',
              hideInput: true,
              browse: true,
              preview: true,
              model: 'upload.residence',
              attributes: {
                input: { 'data-test': 'request-uploadPediatricResidence' },
              },
              required: false,
            },
            // Copia del diploma institucional en Medicina de Urgencias o en su caso Urgencias Pediatricas.
            {
              type: 'pdf',
              label: 'Copia del diploma institucional en Medicina de Urgencias o en su caso Urgencias Pediatricas',
              hint: '',
              hideInput: true,
              browse: true,
              preview: true,
              model: 'upload.postgraduateDiploma',
              attributes: {
                input: { 'data-test': 'request-uploadPostgraduateDiploma' },
              },
              required: false,
            },
            // Tres fotografías oval tamaño diploma(5x7cm) blanco y negro, con fondo blanco, vestimenta formal.Con nombre csompleto al reverso(con tinta).
            {
              type: 'image',
              label: 'Fotografía tamaño diploma en formato JPG/PNG',
              model: 'upload.avatar',
              required: false,
              browse: true,
              preview: true,
              attributes: {
                input: { 'data-test': 'request-uploadPostgraduateDiploma' },
              },
              validator: validators.checkSize,
            },
          ],
        },
        // Submit
        // {
        //   legend: 'Enviar solicitud',
        //   fields: [
        //     {
        //       label: 'Enviar solicitud',
        //       type: 'submit',
        //       visible: true,
        //       onSubmit(model) {
        //         console.log('Form submitted!', model)
        //       },
        //       // onSubmit: function() {
        //       //   console.log('Submited')
        //       //   if (this.modalErrors.length > 0) {
        //       //     this.showModal = true
        //       //   }
        //       // },
        //       validateBeforeSubmit: true,
        //     },
        //   ],
        // },
      ],
    },
  }),
  created() {
    const res = validators.resources
    validators.checkSize = this.checkSize
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
/*
on the validated callbck do an if against isValid i.e. !isValid to trigger the modal
*/
