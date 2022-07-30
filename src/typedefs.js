/**
 * Firebase mail record
 * @typedef {Object} MailRecord
 * @property {string} [cc] - Copy email address
 * @property {string} to - Addressee email address
 * @property {string} [bcc] - Hidden copy email address
 * @property {Object} message
 * @property {string} message.html - mail content
 * @property {string} message.subject - mail subject
 * @property {Object} [delivery] - Fierbase mail plugin data
 * @property {number} [delivery.attempts]
 * @property {Date} [delivery.endTime]
 * @property {Object} [delivery.error]
 * @property {Object} [info]
 * @property {Array} [info.accepted] - list of addressess
 * @property {string} [info.messageId]
 * @property {Array} [info.pending]
 * @property {Array} [info.rejected]
 * @property {string} [info.response]
 * @property {Date} [info.leaseExpireTime]
 * @property {Date} [info.startTime]
 * @property {string} [info.state]
 */

/**
 * Mail
 * @typedef {Object} Mail
 * @property {string} [cc] - Copy email address
 * @property {string} to - Addressee email address
 * @property {string} [bcc] - Hidden copy email address
 * @property {MailTemplate} [template] - A {MailTemplate} {@link MailTemplate}
 * */

/**
 * Mail template to be used in Firebase email plugin
 * @typedef {Object} MailTemplate
 * @property {string} name - Template name in firestore collection (email-templates)
 * @property {Object} data - This is passed as `handlebars` to the template
 * @property {string} data.message - This is variable inside the template
 * @property {string} data.subject - This is variable inside the template
 * */

/** Message
 * @typedef {Object} Message
 * @property {('success'|'error'|'info'|'warning')} type - The severity (color) of the message
 * @property {string} message - The actual text
 */

export {}
