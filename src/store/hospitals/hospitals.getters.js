import { find } from 'lodash'

export default {
  /**
   * Check if a hospital has deletion pending
   */
  isHospitalDeletionPending: state => hospitalId => state.hospitalDeletionPending.includes(hospitalId),

  /**
   * Get hospital by id
   */
  getHospitalById: state => hospitalId => find(state.hospitals, hospital => hospital.id === hospitalId),
}
