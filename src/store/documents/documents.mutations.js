export default {
  /* Product input name */
  setProductNameToCreate: (state, productNameToCreate) => (state.productNameToCreate = productNameToCreate),

  /* Products */
  setProducts: (state, documents) => (state.documents = documents),
  addProduct: (state, product) => state.documents.push(product),
  removeProductById: (state, productId) => {
    const index = state.documents.findIndex(product => product.id === productId)
    state.documents.splice(index, 1)
  },

  /* Products deletion */
  addProductDeletionPending: (state, productId) => state.productDeletionPending.push(productId),
  removeProductDeletionPending: (state, productId) => {
    const index = state.documents.findIndex(product => product.id === productId)
    state.productDeletionPending.splice(index, 1)
  },

  /* Product creation */
  setProductCreationPending: (state, value) => (state.productCreationPending = value),
}
