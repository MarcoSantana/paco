import { orderBy } from 'lodash'
import CollegesDB from '@/firebase/colleges-db'
import CollegeCampiDB from '@/firebase/college-campi-db'

export default {
  /**
       |--------------------------------------------------
       | Fetch all the aviable colleges
       |--------------------------------------------------
    */
  getColleges: async ({ rootState, commit }) => {
    const collegesDb = new CollegesDB(rootState.authentication.user.id)
    const colleges = await collegesDb.readAll()
    const sortedColleges = orderBy(colleges, ['name'], ['asc'])
    commit('setColleges', sortedColleges)
  },
  /**
        |--------------------------------------------------
        | Fetch campi for the selected college
        | @param collegeId
        |--------------------------------------------------
     */
  // Not sure if rootState or should pass explicitly the college instance and /or id
  getCollegeCampi: async ({ commit }, collegeId) => {
    const collegeCampiDB = new CollegeCampiDB(collegeId)
    const campi = await collegeCampiDB.readAll()
    commit('setCampi', campi.sort())
    // return campi.sort()
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
