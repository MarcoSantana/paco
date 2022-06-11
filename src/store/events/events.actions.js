// import { isNil } from 'lodash'
// import UserEveDB from '@/firebase/user-documents-db'
// import UsersDB from '@/firebase/users-db'
import EventsDB from '@/firebase/events-db'
import UserEventsDB from '@/firebase/user-events-db'
import { isNil } from 'lodash'
// import DocumentsDB from '@/firebase/documents-db'
// import { callUpdateDocumentStatus } from '@/firebase/functions'
// import { storage } from 'firebase'

export default {
  /**
   * Fetch documents of current loggedin user
   */
  // getUserDocuments: async ({ rootState, commit }) => {
  //   console.log('Get User Documents')
  //   const userDocumentDb = new UserDocumentsDB(rootState.authentication.user.id)

  //   const documents = await userDocumentDb.readAll()
  //   commit('setDocuments', documents)
  // },

  /*
   * Fetch all documents if logged user is admin
   */
  getAllEvents: async ({ rootState, commit }) => {
    const eventsDb = new EventsDB(`${rootState.authentication.user.id}/**`)
    const events = await eventsDb.readAll()
    commit('setEvents', events)
  },

  getUserEvents: async ({ rootState, commit }) => {
    const userEventsDb = new UserEventsDB(rootState.authentication.user.id)
    const userEvents = await userEventsDb.readAll()
    console.log('userEvents: ', userEvents)
    commit('setUserEvents', userEvents)
  },

  /*
   * Update event for user
   */
  updateUserEvent: async ({ rootState, commit }, data) => {
    const userEventsDb = new UserEventsDB(rootState.authentication.user.id)
    const currentUserEvent = { ...rootState.events.currentUserEvent, data }
    const { documents } = data
    delete data.documents
    console.log('documents', documents)
    // Must keep the files reference as a subcollection
    const refName = `documents.${documents.name}`
    const createdEvent = await userEventsDb.update({
      id: data.id,
      ...currentUserEvent,
      [refName]: documents,
    })
    console.log('createdEvent', createdEvent)
    commit('addUserEvent', data)
  },

  /*
   * Gets the event details for the given user if not exists create
   */
  setUserEvent: async ({ rootState, commit }, id) => {
    console.log('setUserEvent', id)
    const userEventsDb = new UserEventsDB(rootState.authentication.user.id)
    const eventsDB = new EventsDB(rootState)
    console.log(eventsDB)
    const userEvent = await userEventsDb.read(id)

    commit('setCurrentEvent', userEvent)
    console.log('currentEvent', rootState.events.currentEvent)

    console.log('userEvent: ', userEvent)
    // TODO must create the userEvent using the data from the existing event
    if (!userEvent) {
      try {
        // Get the existing event to append it to the user
        const currentEvent = await eventsDB.read(id)
        const createdEvent = await userEventsDb.create(currentEvent, id)
        console.log('createdEvent: ', createdEvent)
        commit('addUserEvent', createdEvent)
        commit('setEventCreationPending', false)
        commit('setEventCreationMessage', {
          type: 'info',
          message: 'Evento creado',
        })
      } catch (error) {
        throw new Error('Error al crear el evento', error)
      }
    }
  },

  setCurrentEventComplete: async ({ commit, rootState }, data) => {
    if (isNil(data.id)) return null
    const userEventsDb = new UserEventsDB(rootState.authentication.user.id)
    const res = await userEventsDb.update(data)
    commit('setCurrentEvent', res)
    return res
  },
}
