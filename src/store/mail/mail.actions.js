import MailDB from '@/firebase/mails-db'
import mail from '.'

export default {
  // ! ||--------------------------------------------------------------------------------||
  // ! ||                              Manages the mail service                          ||
  // ! ||--------------------------------------------------------------------------------||

  /**
   * Sends a email to the specified address
   * @param {import('../../typedefs').Mail} mailData - A mail
   */
  sendMail: async ({ rootState }, mailData) => {
    console.log(rootState)
    if (!Object.prototype.hasOwnProperty.call(mailData, 'template')) {
      // use template factory
      // Does the factory has the 'default' built in?
    }
    const mailDb = new MailDB()
    const mailMessage = mailDb.send(mail)
    console.log('mail message: ', mailMessage)
  }, // sendMail
}
