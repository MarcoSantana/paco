export default {
  documents: null,
  documentNameToCreate: '',
  documentDeletionPending: [],
  documentCreationPending: false,
  dashboardCounters: {},
  currentEvent: {},
  currentEventMessage: {},
  currentDocument: {},
  mail: [],
  /** @type {import('@/typedefs').Message} */
  globalMessage: {},

  // User
  /** @type {Object} */
  currentUser: {},
  /** @type {Array} */
  users: [],
}
