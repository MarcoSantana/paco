import UserFormsDB from '@/firebase/forms-db'

export default {
  /**
   * Fetch forms of current loggedin user
   */
  getUserForms: async ({ rootState, commit }) => {
    const userFormDb = new UserFormsDB(rootState.authentication.user.id)

    const forms = await userFormDb.readAll()
    commit('setForms', forms)
  },

  /**
   * Create a form for current loggedin user
   */
  createUserForm: async ({ commit, rootState }, form) => {
    const userFormDb = new UserFormsDB(rootState.authentication.user.id)

    commit('setFormCreationPending', true)
    const createdForm = await userFormDb.create(form)
    commit('addForm', createdForm)
    commit('setFormCreationPending', false)
  },
  triggerAddCurrentFormAction: ({ commit }, model) => {
    commit('setCurrentForm', model)
  },

  /**
   * Create a new form for current loggedin user and reset form name input
   */
  triggerAddFormAction: ({ dispatch, state, commit }) => {
    if (state.formNameToCreate === '') return

    const form = { name: state.formNameToCreate }
    commit('setFormNameToCreate', '')
    dispatch('createUserForm', form)
  },

  /**
   * Delete a user form from its id
   */
  deleteUserForm: async ({ rootState, commit, getters }, formId) => {
    if (getters.isFormDeletionPending(formId)) return

    const userFormsDb = new UserFormsDB(rootState.authentication.user.id)

    commit('addFormDeletionPending', formId)
    await userFormsDb.delete(formId)
    commit('removeFormById', formId)
    commit('removeFormDeletionPending', formId)
  },
}
