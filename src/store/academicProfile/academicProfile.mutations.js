//  _______ _______
//  |  |  | |______
//  |  |  | ______|
// author: mSantana
// createdAt 2022-05-24 12:17
// Stardate: 202205.24
// fileName: src/store/academicProfile/academicProfile.mutations.js

import AcademicProfileDB from "@/firebase/academicProfile-db"

export default {
  setAcademicProfile: (state, profile) => {
    state.academicProfile = profile
  },

  /**
   * Updates the academic profile in the databse and in the local state
   * */
  updateAcademicProfile: (state, data) => {
    state.academicProfile = { ...state.academicProfile, ...data }
    const academicProfileDb = new AcademicProfileDB(rootState.authentication.user.id)
    await academicProfileDb.update(data)
  },
}
