export default {
  /* Form input name */
  setFormNameToCreate: (state, formNameToCreate) => (state.formNameToCreate = formNameToCreate),

  /**
   |--------------------------------------------------
   | Stores temporary the current form 
   |--------------------------------------------------
*/
  // setCurrentForm: (state, currentForm) => (state.currentForm[0] = currentForm),
  setCurrentForm: (state, currentForm) => {
    console.log('currentForm :>> ', currentForm)
    const map = new Map(Object.entries(currentForm))
    map.forEach((value, key) => {
      state.currentForm[key] = value
    })
    // state.currentForm[0] = currentForm
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
