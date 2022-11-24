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
    accept: 'aceptar solicitud',
    accepted: 'solicitud aceptada',
    acceptedRequests: 'solicitudes aceptadas',
    delete: 'borrar solicitud',
    pending: 'solicitud pendiente',
    pendingRequests: 'solicitudes pendientes',
    plural: 'solicitudes',
    reject: 'rechazadar solicitud',
    rejected: 'rechazada',
    rejectedRequests: 'solicitudes rechazadas',
    singular: 'solicitud',
    colors: {
      accepted: 'success',
      pending: 'warning',
      rejected: 'error',
    },
  },
  mail: {
    cc: 'con copia',
    bcc: 'con copia oculta',
    to: 'destinatario',
    subject: 'asunto',
    body: 'cuerpo del mensaje',
    message: 'mensaje',
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
    address: 'dirección',
    age: 'edad',
    cellphone: 'teléfono celular',
    contactData: 'datos de contacto',
    curp: 'CURP',
    dob: 'fecha de nacimiento',
    documents: 'documentos',
    email: 'correo electrónico',
    events: 'eventos',
    fax: 'fax',
    gender: 'género',
    name: 'nombre',
    lastname1: 'apellido paterno',
    lastname2: 'apeliddo materno',
    license: 'cédula profesional',
    phoneNumber: 'número de teléfono',
    phone: 'teléfono',
    pob: 'lugar de nacimiento (nacionalidad)',
    rfc: 'RFC',
    personalProfile: {
      pob: 'lugar de nacimiento (nacionalidad)',
      dob: 'fecha de nacimiento',
      address: {
        administrative_area_level_1: 'Entidad federativa',
        country: 'País',
        id: 'dirección personal',
        latitude: 'Latitud',
        locality: 'Locallidad',
        longitude: 'Longitud',
        postal_code: 'Código postal',
        route: 'Calle',
        street_number: 'Número de calle',
      },
    },
  },
  messages: {
    bye: 'sales bye',
    cannotUndo: 'esta acción no puede deshacerse',
    confirm: 'confirmar acción',
    hello: 'holas',
    incompleteData: 'datos incompletos',
    mail: {
      sent: 'correo enviado',
    },
    missing: {
      data: 'datos faltantes',
      datas: 'datos faltantes',
      date: 'fecha faltante',
      document: 'documento faltante',
      documents: 'documentos faltantes',
      event: 'evento faltante',
      events: 'eventos faltantes',
      period: 'periodo faltante',
      photo: 'foto faltante',
      photos: 'fotos faltantes',
      user: 'usuario faltante',
      users: 'usuarios faltantes',
    },
    processing: 'procesando',
    pending: 'pendiente',
    request: {
      accepted: 'solicitud aceptada',
      changing: 'cambiando estado de la solicitud',
      deleted: 'solicitud borrada',
      describeReject: 'describa la razón del rechazo',
      prompt: 'actualice su solicitud',
      rejected: 'solicitud rechazada',
    },
    types: {
      error: 'error',
      info: 'información',
      success: 'éxito',
      warning: 'advertencia',
    },
  },
  actions: {
    accept: 'aceptar',
    back: 'atrás',
    cancel: 'cancelar',
    changeStatus: 'cambiar estado',
    clear: 'limpiar',
    close: 'cerrar',
    continue: 'continuar',
    delete: 'borrar',
    download: 'descargar',
    edit: 'editar',
    forward: 'adelante',
    go: 'ir',
    load: 'cargar',
    mark: 'marcar',
    markUnread: 'marcar como no leído',
    preview: 'vista previa',
    quickView: 'vista rápida',
    reject: 'rechazar',
    reload: 'recargar',
    save: 'guardar',
    search: 'buscar',
    send: 'enviar',
    show: 'mostrar',
    upload: 'subir',
  },
  document: {
    actions: {
      accept: 'aceptar',
      reject: 'rechazar',
      delete: 'borrar',
      download: 'descargar',
      of: 'acciones del documento',
      preview: 'vista previa',
      upload: 'subir',
    },
    comment: 'comentario',
    createTimestamp: 'fecha de creación',
    id: 'identificador',
    longName: 'descripción',
    name: 'nombre',
    pending: 'documentos pendientes',
    status: 'estado',
    statusKey: {
      1: 'por revisar',
      2: 'en revisión',
      3: 'rechazado',
      4: 'aceptado',
      5: 'nuevo',
    },
    statusColor: {
      1: 'warning',
      2: 'info',
      3: 'error',
      4: 'success',
      5: 'info',
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
      postDegreeCertificate: 'constancia de residencia progresiva hospitalaria',
      postDegreeDiploma: 'diploma institucional de especialidad',
      postgraduateUniversitaryDiploma: 'diploma universitario de especialidad',
      specialtyDiploma: 'diploma universitario de especialidad',
      specialtyUniversitaryDiploma:
        'diploma institucional universitario de especialidad',
      university: 'universidad',
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
    documentName: 'Perfil académico',
    degree: {
      componentName: 'título',
      documentName: 'título',
      icon: 'mdi-book-open-variant',
    },
    college: {
      componentName: 'Universidad',
      documentName: 'Diploma universitario de licenciatura',
      hint: 'Nombre de la universidad',
      icon: 'mdi-school',
      label: 'Universidad',
      placeholder: 'Nombre de la universidad',
      campus: {
        name: 'Campus',
      },
    },
    updateTimestamp: {
      componentName: 'Fecha de actualización',
      documentName: 'Fecha de actualización',
    },
    createTimestamp: {
      componentName: 'Fecha de creación',
      documentName: 'Fecha de creación',
    },
    curp: {
      componentName: 'Clave Única de Registro de Población',
      documentName: 'CURP',
    },
    registrationYear: {
      componentName: 'Año de registro',
      documentName: 'Año de registro',
    },
    name: {
      componentName: '@:userEdit.name',
      documentName: '@:userEdit.name',
    },
    lastname1: {
      componentName: '@:userEdit.lastname1.label',
      documentName: '@:userEdit.lastname1.label',
    },
    lastname2: {
      componentName: '@:userEdit.lastname2.label',
      documentName: '@:userEdit.lastname2.label',
    },
    license: {
      componentName: 'Cedula profesional de licenciatura',
      documentName: 'Cedula (licenciatura)',
      curp: 'clave única de registro de población %{item}',
      gender: 'Género %{item}',
      institution: 'institución formativa %{item}',
      lastname2: 'apellido materno %{item}',
      lastname: 'apellido paterno %{item}',
      licenseNumber: 'número de cédula profesional %{item}',
      name: 'nombre %{item}',
      registrationYear: 'año de registro %{item}',
      title: 'título %{item}',
      type: 'tipo %{item}',
    },
    specialtyLicense: {
      componentName: 'Cedula profesional de especialista en medicina',
      createTimestamp: 'Fecha de creación',
      curp: '@:academicProfile.license.curp {item}',
      documentName: '@:academicProfile.specialtyLicense.componentName',
      gender: '@:academicProfile.license.gender',
      institution: '@:academicProfile.license.institution',
      lastname2: '@:userEdit.lastname2.label',
      lastname: '@:userEdit.lastname1.label',
      licenseNumber: '@:academicProfile.license.licenseNumber',
      name: '@:userEdit.name.label',
      registrationYear: '@:academicProfile.license.registrationYear',
      title: '@:academicProfile.license.title',
      type: '@:academicProfile.license.type',
      updateTimestamp: 'Fecha de actualizacion',
    },
    specialty: {
      componentName: 'Especialidad',
      createTimestamp: 'Fecha de creación %{item}',
      documentName: 'Especialidad',
      hospital: 'Sede formativa (hospital) %{item}',
      startDate: 'Fecha de inicio %{item}',
      endDate: 'Fecha de finalización %{item}',
    }, // specialty
  },
}
export default translation
