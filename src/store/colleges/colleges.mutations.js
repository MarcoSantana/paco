export default {
  // /* Product input name */
  // setProductNameToCreate: (state, productNameToCreate) => (state.productNameToCreate = productNameToCreate),

  /* Colleges */
  setColleges: (state, colleges) => (state.colleges = colleges),
  addCollege: (state, college) => state.colleges.push(college),
  removeCollegeById: (state, collegeId) => {
    const index = state.colleges.findIndex(college => college.id === collegeId)
    state.colleges.splice(index, 1)
  },

  // /* Products deletion */
  // addProductDeletionPending: (state, productId) => state.productDeletionPending.push(productId),
  // removeProductDeletionPending: (state, productId) => {
  //   const index = state.products.findIndex(product => product.id === productId)
  //   state.productDeletionPending.splice(index, 1)
  // },

  /* Product creation */
  setCollegeCreationPending: (state, value) => (state.collegeCreationPending = value),
}
