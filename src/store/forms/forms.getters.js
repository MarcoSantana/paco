import { find } from 'lodash'

export default {
  /**
     |--------------------------------------------------
     | Returns the form full object but we have to take it out the array first
     |--------------------------------------------------
  */
  getCurrentForm: state => state.currentForm[0],

  /**
   * Check if a form has deletion pending
   */
  isFormDeletionPending: state => formId => state.formDeletionPending.includes(formId),

  /**
   * Get form by id
   */
  getFormById: state => formId => find(state.forms, form => form.id === formId),
}
