import HospitalsDB from '@/firebase/hospitals-db'

export default {
  /**
       |--------------------------------------------------
       | Fetch all the aviable hospitals
       |--------------------------------------------------
  */
  getHospitals: async ({ rootState, commit }) => {
    const hospitalsDb = new HospitalsDB(rootState.authentication.user.id)
    const hospitals = await hospitalsDb.readAll()
    commit('setHospitals', hospitals)
  },
}
