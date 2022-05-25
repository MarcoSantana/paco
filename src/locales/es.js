import { es } from '../../node_modules/vuetify/es5/locale/es'

const translation = {
  ...es,
  // FIXME vuetify translation not working 202112.27-09.25
  $vuetify: { ...es },
  createTimestamp: 'fecha de creación',
  created: 'creado',
  data: 'datos',
  details: 'detalles',
  diploma: 'diploma',
  documentDetails: 'detalles del documento',
  documentId: 'identificador del documento',
  documentType: 'tipo de documento',
  fecha: 'date',
  file: 'archivo',
  functions: 'funciones',
  lastModified: 'última modificación',
  lastRecord: 'último registro',
  message: 'mensaje',
  name: 'nombre',
  preview: 'vista previa',
  registeredUsers: 'usuarios registrados',
  status: 'estado',
  user: 'usuario',
  userId: 'identificador de usuario',
  userName: 'nombre de usuario',

  errors: { missingData: 'datos faltantes' },
  userData: {
    contactData: 'datos de contacto',
    dob: 'fecha de nacimiento',
    pob: 'lugar de nacimiento (nacionalidad)',
    fax: 'fax',
    age: 'edad',
    gender: 'género',
    curp: 'CURP',
    rfc: 'RFC',
    email: 'correo electrónico',
    cellphone: 'teléfono celular',
    phone: 'teléfono',
    address: 'dirección',
  },

  messages: {
    bye: 'sales bye',
    cannotUndo: 'esta acción no puede deshacerse',
    confirm: 'confirmar acción',
    processing: 'procesando',
    hello: 'holas',
  },
  actions: {
    accept: 'aceptar',
    back: 'atras',
    cancel: 'cancelar',
    changeStatus: 'cambiar estado',
    close: 'cerrar',
    continue: 'continuar',
    delete: 'borrar',
    forward: 'adelante',
    mark: 'marcar',
    quickView: 'vista rápida',
    reject: 'rechazar',
    reload: 'recargar',
    save: 'guardar',
    send: 'enviar',
  },
  document: {
    comment: 'comentario',
    createTimestamp: 'fecha de creación',
    id: 'identificador',
    longName: 'descripción',
    name: 'nombre',
    status: 'estado',
    statusKey: { 1: 'por revisar', 2: 'en revisión', 3: 'rechazado', 4: 'aceptado' },
    types: {
      college: 'universidad',
      degree: 'título',
      degreeDiploma: 'diploma universitario de licenciatura',
      enarm: 'comprobante ENARM o similar',
      license: 'cédula profesional',
      mugshot: 'fotografía',
      pediatricVoucher: 'comprobante de pediatría',
      postGraduate: 'institución de posgrado',
      postDegreeDiploma: 'diploma de especialidad',
      postgraduateUniversitaryDiploma: 'diploma universitario de especialidad',
      voucher: 'comprobante de pago',
    },
    updateTimestamp: 'fecha de actualización',
  },
  request: {
    date: 'fecha de la solicitud',
    degree: 'estudios de licenciatura en medicina',
    details: 'detalles de la solicitud',
    enarm: 'documento del ENARM (constancia de haber presentado o equivalente)',
    license: 'cédula',
    place: 'lugar de la solicitud',
    postDegree: 'estudios de posgrado',
    postDegreeCertificate: 'constancia de residencia progresiva hospitalaria',
    postDegreeDiploma: 'diploma institucional en medicina de urgencias o en su caso urgencias pediátricas',
    postDegreeLicense: 'cédula profesional de especialista',
    postgraduateUniversitaryDiploma: 'diploma universitario de especialidad',
    previous: 'examen previo',
    profesionalPractice: 'práctica profesional',
    professionalExerciseCharge: 'cargo',
    professionalExerciseHospital: 'hospital donde labora',
    professionalExerciseLocation: 'dirección',
    schoolHospital: 'hospital formativo',
    specialty: 'especialidad',
    specialtyGraduationDate: 'fecha de graduación',
    title: 'título de la licenciatura en medicina',
    voucher: 'recibo de pago',
  },
  userEdit: {
    license: {
      hint: 'Nivel licenciatura tipo C1 (de 7 a 10 dígitos)',
      icon: 'mdi-badge-account',
      label: 'Cédula profesional',
      placeholder: 'Cédula profesional de licenciatura en medicina',
    },
    email: {
      hint: 'Debe ser una dirección válida',
      icon: 'mdi-email',
      label: 'Correo electrónico',
      placeholder: 'juan.carlos@correo.com',
    },
    name: {
      hint: 'ej. Juan Carlos',
      icon: 'mdi-face',
      label: 'Nombre',
      placeholder: 'Nombres (ej. Juan Carlos)',
    },
    lastname1: {
      hint: 'Primer apellido',
      icon: 'mdi-form-textbox',
      label: 'Apellido paterno',
      placeholder: 'Apellido Paterno (ej. González)',
    },
    lastname2: {
      hint: 'Segundo apellido',
      icon: 'mdi-form-textbox',
      label: 'Apellido materno',
      placeholder: 'Apellido Paterno (ej. González)',
    },
    phoneNumber: {
      hint: ' Debe ser un número de teléfono válido en México',
      icon: 'mdi-cellphone-basic',
      label: 'Teléfono celular',
      placeholder: '##########',
    },
  },
    academicProfile: {
        id: 'número de cédula profesional',
        curp: 'clave única de registro de población',
        gender: 'género',
        institution: 'institución formativa',
        name: () => translation.userEdit.name.label,
        lastname: () => translation.userEdit.lastname1.label ,
        lastname2: () => translation.userEdit.lastname2.label,
        registrationYear: 'año de registro',
        title: 'título',
        type: 'tipo',
    }
}

export default translation
