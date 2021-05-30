import CollegesDB from '@/firebase/colleges-db'

export default {
  getColleges: async ({ rootState, commit }) => {
    const collegesDb = new CollegesDB(rootState.authentication.user.id)
    const colleges = await collegesDb.readAll()
    commit('setColleges', colleges)
  },
  // /**
  //  * Fetch products of current logged-in user
  //  */
  // getUserProducts: async ({ rootState, commit }) => {
  //   const userProductDb = new UserProductsDB(rootState.authentication.user.id)
  //   const products = await userProductDb.readAll()
  //   commit('setProducts', products)
  // },
  // /**
  //  * Create a product for current logged-in user
  //  */
  // createUserProduct: async ({ commit, rootState }, product) => {
  //   const userProductDb = new UserProductsDB(rootState.authentication.user.id)
  //   commit('setProductCreationPending', true)
  //   const createdProduct = await userProductDb.create(product)
  //   commit('addProduct', createdProduct)
  //   commit('setProductCreationPending', false)
  // },
  // /**
  //  * Create a new product for current logged-in user and reset product name input
  //  */
  // triggerAddProductAction: ({ dispatch, state, commit }) => {
  //   if (state.productNameToCreate === '') return
  //   const product = { name: state.productNameToCreate }
  //   commit('setProductNameToCreate', '')
  //   dispatch('createUserProduct', product)
  // },
  // /**
  //  * Delete a user product from its id
  //  */
  // deleteUserProduct: async ({ rootState, commit, getters }, productId) => {
  //   if (getters.isProductDeletionPending(productId)) return
  //   const userProductsDb = new UserProductsDB(rootState.authentication.user.id)
  //   commit('addProductDeletionPending', productId)
  //   await userProductsDb.delete(productId)
  //   commit('removeProductById', productId)
  //   commit('removeProductDeletionPending', productId)
  // },
}
