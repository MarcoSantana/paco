import { es } from '../../node_modules/vuetify/es5/locale/es'

export default {
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
}
