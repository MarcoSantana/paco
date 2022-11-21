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
  async send({ to, cc, bcc, template }) {
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
          message: 'Es necesaria la plantilla del correo',
        })
      } // if

      /** @type {import('src/typedefs').Mail}  */
      const data = {
        to,
        cc,
        bcc,
        template,
      }
      await this.create(data).then((res) => res)
      return new Message({ type: 'success', message: 'mail.sent' })
    } catch (err) {
      return new Message({ type: 'error', message: err })
    }
  } // send

  /**
   * Gets the html from the given template
   * @param {string} template
   * @return {string} The html from the template (not parsed)
   */
  async getRawTemplate(template) {
    try {
      const localTemplate =
        template == undefined || template == null ? 'default' : template
      const result = this.read(localTemplate)
      return result.data
    } catch (err) {
      return new Message({ type: 'error', message: err })
    }
  } // getRawTemplate
}
