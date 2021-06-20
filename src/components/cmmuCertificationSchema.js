import { validators } from 'vue-form-generator'

export default {
  data: () => ({
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
              validator: ['required'],
            },
            // - [ ] Fecha de solicitud
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
              validator: ['required'],
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
              validator: ['required', 'regexp'],
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
                input: { 'data-test': 'request-lastName2' },
              },
              visibility: 'true',
              styleClasses: 'document-form',
              validator: ['regexp', 'required'],
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
              validator: ['required'],
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
              validator: ['required'],
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
              validator: ['required', 'regexp'],
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
              validator: ['required', 'regexp'],
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
              onPlaceChanged: (value, place, rawPlace, model, schema) => {
                console.log('value :>> ', value)
                console.log('place :>> ', place)
                console.log('rawPlace :>> ', rawPlace)
                console.log('model :>> ', model)
                console.log('schema :>> ', schema)
              },
              validator: ['required'],
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
              validator: ['required'],
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
              validator: ['required', 'regexp'],
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
              validator: ['required', 'regexp'],
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
              validator: ['required', 'regexp'],
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
              validator: ['email', 'required'],
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
              validator: ['required'],
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
              validator: ['required'],
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
              validator: ['required'],
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
              validator: ['required'],
            },
            // Previous exam
            {
              type: 'checkbox',
              label: '¿Ha realizado previamente el examen?',
              model: 'request.previousExam',
              attributes: {
                input: { 'data-test': 'previousExam' },
              },
            },
            // professional license
            {
              type: 'input',
              inputType: 'text',
              label: 'Cédula profesional',
              model: 'request.postgraduate.license',
              validator: ['regexp'],
              pattern: '^[0-9]{8}([0-9]{7})?$',
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
              model: 'request.professionalExercise.description',
              hint: 'Ej. Consultorio privado, Hospital General No. 450, Durango',
              validator: ['required'],
            },
            {
              type: 'googleAddress',
              label: 'Dirección del trabajo',
              placeholder: 'Dirección',
              model: 'request.professionalExercise.location',
              validator: ['required'],
            },
            // Charge
            {
              type: 'input',
              inputType: 'text',
              label: 'Cargo',
              model: 'request.professionalExercise.charge',
              maxlength: 50,
              placeholder: 'Describa brevemente',
              validator: ['required'],
            },
          ],
        },
        // Payment
        {
          legend: 'Comprobante de pago',
          fields: [
            // Payment voucher
            {
              type: 'pdf',
              label: 'Cargar comprobante de pago',
              hideInput: true,
              browse: true,
              preview: true,
              model: 'request.voucher',
              validator: ['required'],
            },
          ],
        },
      ],
    },
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
