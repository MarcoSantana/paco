import { es } from '../../node_modules/vuetify/es5/locale/es'

export default {
  ...es,
  $vuetify: { ...es },
  message: {
    hello: 'holas',
    bye: 'sales bye',
  },
  actions: { send: 'enviar', save: 'guardar', delete: 'borrar', mark: 'marcar' },
  document: {
    id: 'identificador',
    name: 'nombre',
    longName: 'descripción',
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
    },
  },
}
