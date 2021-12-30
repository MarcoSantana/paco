import { es } from '../../node_modules/vuetify/es5/locale/es'

export default {
  ...es,
  // FIXME vuetify translation not working 202112.27-09.25
  $vuetify: { ...es },
  file: 'archivo',
  message: {
    hello: 'holas',
    bye: 'sales bye',
    confirm: 'confirmar acción',
    cannotUndo: 'esta acción no puede deshacerse',
  },
  actions: {
    send: 'enviar',
    save: 'guardar',
    delete: 'borrar',
    mark: 'marcar',
    back: 'atras',
    forward: 'adelante',
    continue: 'continuar',
  },
  document: {
    id: 'identificador',
    name: 'nombre',
    longName: 'descripción',
    comment: 'comentario',
    createTimestamp: 'fecha de creación',
    updateTimestamp: 'fecha de actualización',
    status: 'estado',
    statusKey: {
      1: 'por revisar',
      2: 'en revisión',
      3: 'rechazado',
      4: 'aceptado',
    },
    types: {
      degree: 'título',
      license: 'cédula profesional',
      college: 'universidad',
      postGraduate: 'institución de posgrado',
      voucher: 'comprobante de pago',
      enarm: 'comprobante ENARM o similar',
      diploma: 'diploma',
    },
  },
}
