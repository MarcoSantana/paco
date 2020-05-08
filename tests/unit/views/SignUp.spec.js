import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import SignUpView from '@/views/SignUp.vue'

const defaultStoreStructure = {
  modules: {
    app: {
      namespaced: true,
      state: {
        networkOnLine: true,
      },
    },
    authentication: {
      namespaced: true,
      state: {
        user: undefined,
      },
      mutations: {
        setUser: jest.fn(),
      },
    },
  },
} // defaultStoreStructure

const localVue = createLocalVue()
localVue.use(Vuex)

const $router = {
  push: jest.fn(),
}

describe('SignUpView', () => {
  describe('when user is defined', () => {
    let storeStructure

    beforeEach(() => {
      storeStructure = cloneDeep(defaultStoreStructure)
      storeStructure.modules.authentication.state.user = 'Evan'
    })

    describe('and redirectUrl is defined', () => {
      it('should redirect to redirectUrl', () => {
        const store = new Vuex.Store(storeStructure)
        const redirectUrl = '/redirectUrl'
        shallowMount(SignUpView, {
          store,
          localVue,
          mocks: {
            $route: {
              query: {
                redirectUrl,
              },
            },
            $router,
          },
        }) // shallowMount
        expect($router.push).toHaveBeenCalledWith(redirectUrl)
      })
    }) // and redirectUrl is defined
  })
})
