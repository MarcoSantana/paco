//  _______ _______
//  |  |  | |______
//  |  |  | ______|
// author: mSantana
// createdAt 2020-05-06 07:21
// Stardate: 202005.06
// fileName: documents/documents.mutations.js
export default {
  /* Document input name */
  setDocumentNameToCreate: (state, documentNameToCreate) =>
    (state.documentNameToCreate = documentNameToCreate),

  /* Documents */
  setDocuments: (state, documents) => (state.documents = documents),
  addDocument: (state, document) => state.documents.push(document),
  removeDocumentById: (state, documentId) => {
    const index = state.documents.findIndex(
      document => document.id === documentId
    )
    state.documents.splice(index, 1)
  },

  /* Documents deletion */
  addDocumentDeletionPending: (state, documentId) =>
    state.documentDeletionPending.push(documentId),
  removeDocumentDeletionPending: (state, documentId) => {
    const index = state.documents.findIndex(
      document => document.id === documentId
    )
    state.documentDeletionPending.splice(index, 1)
  },

  /* Document creation */
  setDocumentCreationPending: (state, value) =>
    (state.documentCreationPending = value),

  /* Dashboard counters */
  setRejectedRequestsCounter: (state, value) =>
    (state.dashboardCounters.rejectedRequests = value),
  setAcceptedRequestsCounter: (state, value) =>
    (state.dashboardCounters.acceptedRequests = value),
  setPendingRequestsCounter: (state, value) =>
    (state.dashboardCounters.pendingRequests = value),
  setTotalRequestsCounter: (state, value) =>
    (state.dashboardCounters.totalRequests = value),
  setCurrentDocument: (state, value) => (state.currentDocument = value),
  setCurrentEvent: (state, value) => (state.currentEvent = value),
  setCurrentEventMessage: (state, value) => (state.currentEventMessage = value),
  setGlobalMessage: (state, value) => (state.globalMessage = value),
  setCurrentUser: (state, value) => (state.currentUser = value),
  // TODO updateUsers
  setUsers: (state, value) => {
    state.users = value
    localStorage.setItem('users', JSON.stringify(state.users))
  },
  updateUsers: (state, value) => {
    value.forEach(user => {
      const index = state.users.findIndex(localuser => localuser.id === user.id)
      if (index < 0) state.users.push(user)
    })
    localStorage.setItem('users', JSON.stringify(state.users))
  }, // updateUsers
  setMails: (state, value) => (state.mails = value),
}
