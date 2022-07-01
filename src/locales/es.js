import { es } from '../../node_modules/vuetify/es5/locale/es'

const translation = {
  ...es,
  // FIXME vuetify translation not working 202112.27-09.25
  $vuetify: { ...es },
  activeUsers: 'usuarios activos',
  createTimestamp: 'fecha de creación',
  created: 'creado',
  data: 'datos',
  date: 'fecha',
  description: 'descripción',
  details: 'detalles',
  diploma: 'diploma',
  documentDetails: 'detalles del documento',
  documentId: 'identificador del documento',
  documentType: 'tipo de documento',
  endDate: 'fecha de finalización',
  file: 'archivo',
  functions: 'funciones',
  lastModified: 'última modificación',
  lastRecord: 'último registro',
  message: 'mensaje',
  name: 'nombre',
  pending: 'pendiente',
  period: 'periodo',
  preview: 'vista previa',
  registeredUsers: 'usuarios registrados',
  requests: {
    acceptedRequests: 'solicitudes aceptadas',
    pendingRequests: 'solicitudes pendientes',
    plural: 'solicitudes',
    rejectedRequests: 'solicitudes rechazadas',
    singular: 'solicitud',
  },
  status: 'estado',
  startDate: 'fecha de inicio',
  user: 'usuario',
  userId: 'identificador de usuario',
  userName: 'nombre de usuario',
  charts: {
    singular: 'gráfico',
    plural: 'gráficos',
    date: 'fecha',
    data: 'datos',
    month: 'mes',
    year: 'año',
    week: 'semana',
    day: 'día',
    hour: 'hora',
    minute: 'minuto',
    second: 'segundo',
    period: 'periodo',
    total: 'total',
    average: 'promedio',
    minimum: 'mínimo',
    maximum: 'máximo',
    certifications: 'certificaciones',
    revalidations: 'revalidaciones',
    inscriptions: 'inscripciones',
    registrations: 'registros',
    requests: 'solicitudes',
  },
  errors: { missingData: 'datos faltantes' },
  event: {
    event: 'evento',
    events: 'eventos',
    name: 'nombre del evento',
    userLimit: 'límite de usuarios',
  },
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
    incompleteData: 'datos incompletos',
    processing: 'procesando',
  },
  actions: {
    accept: 'aceptar',
    back: 'atras',
    cancel: 'cancelar',
    changeStatus: 'cambiar estado',
    clear: 'limpiar',
    close: 'cerrar',
    continue: 'continuar',
    delete: 'borrar',
    edit: 'editar',
    forward: 'adelante',
    go: 'ir',
    load: 'cargar',
    mark: 'marcar',
    markUnread: 'marcar como no leído',
    quickView: 'vista rápida',
    reject: 'rechazar',
    reload: 'recargar',
    save: 'guardar',
    search: 'buscar',
    send: 'enviar',
    show: 'mostrar',
  },
  document: {
    comment: 'comentario',
    createTimestamp: 'fecha de creación',
    id: 'identificador',
    longName: 'descripción',
    name: 'nombre',
    status: 'estado',
    statusKey: {
      1: 'por revisar',
      2: 'en revisión',
      3: 'rechazado',
      4: 'aceptado',
    },
    types: {
      college: 'universidad',
      degree: 'título',
      degreeDiploma: 'diploma universitario de licenciatura',
      enarm: 'comprobante ENARM o similar',
      license: 'cédula profesional',
      mugshot: 'fotografía personal',
      pediatricVoucher: 'comprobante de pediatría',
      postGraduate: 'institución de posgrado',
      postDegreeDiploma: 'diploma de especialidad',
      postgraduateUniversitaryDiploma: 'diploma universitario de especialidad',
      specialtyDiploma: 'diploma universitario de especialidad',
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
    postDegreeDiploma:
      'diploma institucional en medicina de urgencias o en su caso urgencias pediátricas',
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
    license: {
      componentName: 'Cedula profesional de especialista en medicina',
      curp: 'clave única de registro de población {item}',
      gender: 'Género {item}',
      institution: 'institución formativa {item}',
      lastname2: '@:userEdit.lastname2.label {item}',
      lastname: '@:userEdit.lastname1.label {item}',
      licenseNumber: 'número de cédula profesional {item}',
      name: '@:userEdit.name.label {item}',
      registrationYear: 'año de registro {item}',
      title: 'título {item}',
      type: 'tipo {item}',
    },
    specialtyLicense: {
      componentName: 'Cedula profesional de especialista en medicina',
      curp: '@:academicProfile.license.curp {item}',
      gender: '@:academicProfile.license.gender {item}',
      institution: '@:academicProfile.license.institution {item}',
      lastname2: '@:userEdit.lastname2.label {item}',
      lastname: '@:userEdit.lastname1.label {item}',
      licenseNumber: '@:academicProfile.license.licenseNumber {item}',
      name: '@:userEdit.name.label {item}',
      registrationYear: '@:academicProfile.license.registrationYear {item}',
      title: '@:academicProfile.license.title {item}',
      type: '@:academicProfile.license.type {item}',
    },
  },
}
export default translation
