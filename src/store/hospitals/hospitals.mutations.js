export default {
  /* Hospitals */
  setHospitals: (state, hospitals) => (state.hospitals = hospitals),
  addHospital: (state, hospital) => state.hospitals.push(hospital),
  removeHospitalById: (state, hospitalId) => {
    const index = state.hospitals.findIndex(hospital => hospital.id === hospitalId)
    state.hospitals.splice(index, 1)
  },

  /* Hospital creation */
  setHospitalCreationPending: (state, value) => (state.hospitalCreationPending = value),
}
