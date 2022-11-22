// @ts-check
import Handlebars from 'handlebars'
import MailsDB from '@/firebase/mails-db'

const mailDb = new MailsDB()

/**
 * Constructs a mail object to be set by Firebase plugin
 * @param {String} to
 * @param {String} [cc]
 * @param {String} [bcc]
 * @param {import('../typedefs').MailTemplate} template - The template used by the plugin
 * @returns {import('../typedefs').Mail} mailData - A mail
 */
export default function createMail({ to, cc, bcc, template }) {
  return {
    to,
    cc,
    bcc,
    template: createTemplate(template),
    // getSendStatus
    sendMail,
    showPreview,
  }
} // mailFactory

/**
 * Constructs a mail.template object, to be used inside mail
 * @return {import('../typedefs').MailTemplate}
 */
const createTemplate = ({ message, subject, username, name }) => ({
  message,
  subject,
  username,
  name: (() => {
    name ? name : 'default'
  })(),
}) // templateFactory

/**
 * Calls the given action from firebase mails-db
 * @param {String} to
 * @param {String} cc
 * @param {String | null} [bcc]
 * @param {import('../typedefs')} template
 */
const sendMail = (to, cc, bcc, template) => {
  mailDb.sendMail(to, cc, bcc, template).then((message) => {
    // store message in  Vuex
    console.log(message)
  })
} // sendMail

/**
 * Shows the mail preview using the given template
 * @param {String} to
 * @param {String} cc
 * @param {String | null} [bcc]
 * @param {import('../typedefs')} template
 * @returns {String} The mail preview in html format
 */
const showPreview = async (to, cc, bcc, template) => {
  const rawTemplate = await mailDb.getRawTemplate()
  const handlebarsTemplate = Handlebars.compile(rawTemplate)
  return handlebarsTemplate(...template.data)
} // showPreview

// export default {
//   mailFactory: createMail,
//   templateFactory: createTemplate,
// }
