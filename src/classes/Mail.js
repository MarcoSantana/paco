//@ts-check
import Handlebars from 'handlebars'
import MailsDB from '@/firebase/mails-db'

const mailDb = new MailsDB()

/**
 * Constructs a mail object to be set by Firebase plugin
 * @vue-param {String} to
 * @vue-param {String} [cc]
 * @vue-param {String} [bcc]
 * @param {import('../typedefs').MailTemplate} template - The template used by the plugin
 * @returns {import('../typedefs').Mailer} mailer - A mail object
 */
export default function createMail({ to, cc, bcc, template }) {
  return {
    to,
    cc,
    bcc,
    template: createTemplate(template),
    // getSendStatus
    sendMail,
    showPreview: async () => {
      const rawTemplate = await mailDb.getRawTemplate(template.name)
      const handlebarsTemplate = Handlebars.compile(rawTemplate)
      return handlebarsTemplate({ message: template.message })
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
 * @param {import('../typedefs')} template
 * @returns {String} The mail preview in html format
 */
// const showPreview = async function (template) {
//   console.log('template: ' + template)
//   debugger
//   const rawTemplate = await mailDb.getRawTemplate('default')
//   console.log('rawTemplate', rawTemplate)
//   const handlebarsTemplate = Handlebars.compile(rawTemplate)
//   console.log(handlebarsTemplate({ message: 'rocks!' })) // const template =
//   const result = handlebarsTemplate({ message: 'rocks!' })
//   console.log('result', result)
//   return result
// } // showPreview
