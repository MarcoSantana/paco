//  _______ _______
//  |  |  | |______
//  |  |  | ______|
/* 
 author 🥋: mSantana 
 directory 📁: ~/Development/paco/src/store/events 
 filename 📄: events.mutations.js 
 stardate 🚀: 202111.25-19.15 
 */
export default {
  /* Event input name */
  setEventNameToCreate: (state, eventNameToCreate) => (state.documentNameToCreate = eventNameToCreate),

  /* Events */
  setEvents: (state, events) => (state.events = events),
  addDocument: (state, document) => state.documents.push(document),
  removeEventById: (state, eventId) => {
    const index = state.events.findIndex(document => document.id === eventId)
    state.events.splice(index, 1)
  },

  /* Events deletion */
  addEventDeletionPending: (state, eventId) => state.documentDeletionPending.push(eventId),
  removeDocumentDeletionPending: (state, eventId) => {
    const index = state.events.findIndex(event => event.id === eventId)
    state.addEventDeletionPending.splice(index, 1)
  },

  /* Event creation */
  setEventCreationPending: (state, value) => (state.eventCreationPending = value),

  /* Event creation messages */
  setEventCreationMessage: (state, payload) => (state.eventCreationMessage = payload),
}
