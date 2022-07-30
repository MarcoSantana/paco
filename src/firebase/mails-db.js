import Message from '@/classes/Message'
import GenericDB from './generic-db'

export default class MailsDB extends GenericDB {
  constructor() {
    super('mail')
  }

  /**
   * Updates 'mails' collection to trigger mail sending
   * @param {import('src/typedefs').Mail} payload - A mail
   * @returns {Message}
   */
  async send({ to, cc = 'cmmu2009@yahoo.com.mx', template }) {
    try {
      if (!to) {
        return new Message({
          type: 'error',
          message: 'Error al enviar correo, es necesario ingresar un remitente',
        })
      }
      if (!template) {
        return new Message({
          type: 'error',
          message: 'Es necesario el contenido del correo',
        })
      } // if

      /** @type {import('src/typedefs').Mail}  */
      const data = {
        to,
        cc,
        // bcc: 'marco.santana@gmail.com',
        template,
      }
      await this.create(data).then(res => res)
      return new Message({ type: 'success', message: 'mail.sent' })
    } catch (err) {
      return new Message({ type: 'error', message: err })
    }
  } // send
}
