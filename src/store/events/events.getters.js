import { find } from 'lodash'

export default {
  /**
   * Check if a event has deletion pending
   */
  isEventDeletionPending: (state) => (eventId) =>
    state.eventDeletionPending.includes(eventId),

  /**
   * Get event by id
   */
  getEventById: (state) => (eventId) =>
    find(state.events, (event) => event.id === eventId),

  /**
   * Get event from user events
   */
  getUserEvent: (state) => (eventId) =>
    find(state.userEvents, (event) => event.id === eventId),

  /**
   * Get the current event
   * @param {Object} state
   * @return {Object}
   * */
  getCurrentEvent: (state) => state.currentEvent,

  /**
   *  Get active events
   * @param {Object} state
   * @returns collection
   */
  getActiveEvents: (state) =>
    find(state.evets, (event) => event.active === true),

  /**
   * Get all events
   * @param {Object} state
   * @returns collection
   */
  getAllEvents: (state) => state.events,
}
