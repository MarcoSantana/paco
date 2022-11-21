// Translation
import myEs from '@/locales/es'

/** Message to be delivered tto user in UI */
export default class Message {
  /**
   * Create a message
   * @param {Object} params
   * @param {('success','error','info','warning')} type - The severity (color) of the message
   * @param {string} message - The actual text
   */
  constructor({ type, message } = {}) {
    /** @type {['success','error','info','warning']}  */
    this.type = type
    /** @type {string} */
    this.message = message
  }

  /**
   * currentType
   * @type {Message.type}
   * @param {Message.type} newType
   */
  set currentType(newType) {
    this.type = newType
  }

  /**
   * currentMessage
   * @type {Message.message}
   * @param {Message.type} newMessage
   */
  set currentMessage(newMessage) {
    this.message = newMessage
  }

  /**
   * Get the message body
   * @returns {string} The message bodu
   */
  get text() {
    return this.message.toString()
  }

  /**
   * Get the color
   * @returns {string} */
  get color() {
    const colors = {
      error: '#FF5252',
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FFC107',
    }
    return colors[this.type]
  }

  /**
   * Get the translated message type
   * @returns {string}
   */
  get typeString() {
    return myEs.messages.types[this.type]
  }
}
