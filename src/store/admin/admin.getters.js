import { find } from 'lodash'

export default {
  /**
   * Check if a document has deletion pending
   */
  isDocumentDeletionPending: state => documentId =>
    state.documentDeletionPending.includes(documentId),

  /**
   * Get document by id
   */
  getDocumentById: state => documentId =>
    find(state.documents, document => document.id === documentId),

  getPendingRequests: state => {
    const pendingRequest = find(
      state.pendingRequests,
      request => request.id === 'pendingRequests'
    )
    return pendingRequest
  },

  currentUserPersonalProfile: state => state.personalProfile,

  userProfile: state => state.personalProfile,

  userDegree: state => {
    return find(state.currentUser.profile, { documentName: 'degree' })
  }, // userDegree

  userLicense: state => {
    const res = find(state.currentUser.profile, { documentName: 'license' })
    const { gender, title, registrationYear, licenseNumber } = res
    return {
      gender,
      title,
      registrationYear,
      licenseNumber,
    }
  }, // userLicense

  userSpecialtyLicense: state => {
    const res = find(state.currentUser.profile, { documentName: 'specialtyLicense' })
    const { gender, title, registrationYear, licenseNumber } = res
    return {
      gender,
      title,
      registrationYear,
      licenseNumber,
    }
  }, // userSpecialtyLicense

  userSpecialty: state => {
    const res = find(state.currentUser.profile, { documentName: 'specialty' })
    return {
      hospital: res.hospital.name,
      startDate: res.startDate,
      endDate: res.startDate,
    }
  }, // userSpecialtyLicense




}
