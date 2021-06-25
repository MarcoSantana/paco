import { cloneDeep } from 'lodash'

export default {
  /* Form input name */
  setFormNameToCreate: (state, formNameToCreate) => (state.formNameToCreate = formNameToCreate),

  /**
   |--------------------------------------------------
   | Stores temporary the current form 
   |--------------------------------------------------
*/
  setCurrentForm: (state, currentForm) => {
    state.currentForm = cloneDeep(currentForm)
  },
  /* Forms */
  setForms: (state, forms) => (state.forms = forms),
  addForm: (state, form) => state.forms.push(form),
  removeFormById: (state, formId) => {
    const index = state.forms.findIndex(form => form.id === formId)
    state.forms.splice(index, 1)
  },

  /* Forms deletion */
  addFormDeletionPending: (state, formId) => state.formDeletionPending.push(formId),
  removeFormDeletionPending: (state, formId) => {
    const index = state.forms.findIndex(form => form.id === formId)
    state.formDeletionPending.splice(index, 1)
  },

  /* Form creation */
  setFormCreationPending: (state, value) => (state.formCreationPending = value),
}
