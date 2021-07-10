import Vue from 'vue'
import Router from 'vue-router'
import Head from 'vue-head'
import Home from '@/views/Home'
import CheckLogin from '@/views/CheckLogin'
import { isNil } from 'lodash'
import store from '@/store'

Vue.use(Router)

/* If you don't know about VueHead, please refer to https://github.com/ktquez/vue-head */

Vue.use(Head, {
  complement: process.env.VUE_APP_TITLE,
})

/* If you don't know about VueRouter, please refer to https://router.vuejs.org/ */

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        authNotRequired: true,
      },
    },
    {
      path: '/check-login',
      name: 'check-login',
      component: CheckLogin,
      meta: {
        authNotRequired: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "client-chunk-login" */ '@/views/Login.vue'),
      meta: {
        authNotRequired: true,
      },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import(/* webpackChunkName: "client-chunk-login" */ '@/views/SignUp.vue'),
      meta: {
        authNotRequired: true,
      },
    },
    {
      path: '/curriculum',
      name: 'curriculum',
      component: () => import(/* webpackChunkName: "client-chunk-login" */ '@/views/Curriculum.vue'),
    },
    {
      path: '/request',
      name: 'request',
      component: () => import(/* webpackChunkName: "client-chunk-login" */ '@/views/CertificationRequest.vue'),
    },
    {
      path: '/products',
      name: 'products',
      component: () => import(/* webpackChunkName: "client-chunk-products" */ '@/views/Products.vue'),
    },
    {
      path: '/documents',
      name: 'documents',
      component: () => import(/* webpackChunkName: "client-chunk-documents" */ '@/views/Documents.vue'),
    },
    {
      path: '/products/:id',
      name: 'product',
      props: true,
      component: () => import(/* webpackChunkName: "client-chunk-product-details" */ '@/views/Product.vue'),
    },
    {
      path: '/documents/:id',
      name: 'document',
      props: true,
      component: () => import(/* webpackChunkName: "client-chunk-document-details" */ '@/views/Document.vue'),
    },

    // Admin routes
    // // Show all users
    // {
    //   path: '/users',
    //   name: 'users',
    //   component: () => import(/* webpackChunkName: "client-chunk-users-details" */ '@/components/admin/Users.vue'),
    // },

    // Main admin view
    {
      path: '/admin/home',
      name: 'adminHome',
      component: () => import(/* webpackChunkName: "client-chunk-main-details" */ '@/views/admin/Main.vue'),
    },

    // Default route
    { path: '*', redirect: '/home' },
  ],
})

/**
 * Handle user redirections
 */
// eslint-disable-next-line consistent-return
router.beforeEach((to, from, next) => {
  if (!(to.meta && to.meta.authNotRequired) && isNil(store.state.authentication.user)) {
    const path = store.state.authentication.user === null ? '/login' : '/check-login'
    return next(`${path}?redirectUrl=${to.path}`)
  }
  next()
})

export default router
