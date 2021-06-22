import { find } from 'lodash'

export default {
  /**
   * Check if a form has deletion pending
   */
  isFormDeletionPending: state => formId => state.formDeletionPending.includes(formId),

  /**
   * Get form by id
   */
  getFormById: state => formId => find(state.forms, form => form.id === formId),
}
