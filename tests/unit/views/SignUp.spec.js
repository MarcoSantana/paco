import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import { createLocalVue, shallowMount, mount } from '@vue/test-utils'
import SignUpView from '@/views/SignUp.vue'

import * as VeeValidate from 'vee-validate'

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
localVue.use(VeeValidate)
localVue.component('validation-provider', VeeValidate.ValidationProvider)
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

  describe('registration', () => {
    const storeStructure = cloneDeep(defaultStoreStructure)
    const store = new Vuex.Store(storeStructure)
    const wrapper = mount(SignUpView, {
      stubs: ['validation-provider'],
      store,
      localVue,
    })
    console.log('wrapper: ', wrapper)
  }) // registration
})
