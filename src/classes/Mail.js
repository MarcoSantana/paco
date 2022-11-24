import Handlebars from 'handlebars'
import MailsDB from '@/firebase/mails-db'

const mailDb = new MailsDB()

/**
 * Constructs a mail object to be set by Firebase plugin
 * @vue-param {String} to
 * @vue-param {String} [cc]
 * @vue-param {String} [bcc]
 * @vue-param {String} [username]
 * @param {import('../typedefs').MailTemplate} template - The template used by the plugin
 * @returns {import('../typedefs').Mailer} mailer - A mail object
 */
export default function createMail({ to, cc, bcc, template }) {
  return {
    to,
    cc: (() => (cc ? cc : ''))(),
    bcc: (() => (bcc ? bcc : ''))(),
    template: createTemplate(template),
    // getSendStatus
    // send: async () => mailDb.send({ to, cc, bcc, template }),
    send: () => send({ to, cc, bcc, template }),
    showPreview: async () => {
      const rawTemplate = await mailDb.getRawTemplate(template.name)
      const handlebarsTemplate = Handlebars.compile(rawTemplate)
      return handlebarsTemplate({ ...template })
    },
  }
} // mailFactory

/**
 * Constructs a mail.template object, to be used inside mail
 * @return {import('../typedefs').MailTemplate}
 */
const createTemplate = ({ message, subject, username, name }) => ({
  message,
  subject,
  username: (() => (username ? username : ''))(),
  name: (() => (name ? name : 'default'))(),
}) // templateFactory

/**
 * Calls the given action from firebase mails-db
 * @param {String} to
 * @param {String} cc
 * @param {String | null} [bcc]
 * @param {import('../typedefs')} template
 */
const send = function ({ to, cc, bcc, template }) {
  const result = mailDb.send({ to, cc, bcc, template })
  return result
} // sendMail
