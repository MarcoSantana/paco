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
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-login" */ '@/views/Login.vue'
        ),
      meta: {
        authNotRequired: true,
      },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-login" */ '@/views/SignUp.vue'
        ),
      meta: {
        authNotRequired: true,
      },
    },
    {
      path: '/curriculum',
      name: 'curriculum',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-login" */ '@/views/Curriculum.vue'
        ),
    },
    {
      path: '/request',
      name: 'request',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-login" */ '@/views/CertificationRequest.vue'
        ),
    },
    {
      path: '/products',
      name: 'products',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-products" */ '@/views/Products.vue'
        ),
    },
    {
      path: '/downloads',
      name: 'userDownloads',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-downloads" */ '@/views/Downloads.vue'
        ),
    },
    {
      path: '/documents',
      name: 'documents',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-documents" */ '@/views/Documents.vue'
        ),
    },
    {
      path: '/products/:id',
      name: 'product',
      props: true,
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-product-details" */ '@/views/Product.vue'
        ),
    },
    {
      path: '/documents/:id',
      name: 'document',
      props: true,
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-document-details" */ '@/views/Document.vue'
        ),
    },
    {
      path: '/admin/documents/:id',
      name: 'document-view',
      props: true,
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-document-details" */ '@/views/admin/DocumentView.vue'
        ),
    },

    {
      path: '/events/:id',
      name: 'eventView',
      props: true,
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-document-details" */ '@/views/EventView.vue'
        ),
    },

    // Admin routes
    // // Show all users
    {
      path: '/users',
      name: 'users',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-users-details" */ '@/views/admin/users/Main.vue'
        ),
    },

    // Main admin view
    {
      path: '/admin/home',
      name: 'adminHome',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-main-details" */ '@/views/admin/Main.vue'
        ),
    },

    // Admin dashboard
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-main-details" */ '@/views/admin/dashboard/Dashboard.vue'
        ),
    },

    // Admin requests
    {
      path: '/admin/requests',
      name: 'adminRequests',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-main-details" */ '@/views/admin/requests/Requests.vue'
        ),
    },

    // Admin single request
    {
      path: '/admin/requests/:id',
      name: 'adminRequest',
      props: true,
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-main-details" */ '@/views/admin/requests/Request.vue'
        ),
    },

    // Shows details for a single user-event

    {
      path: '/admin/request/user/:user',
      name: 'adminUserEventDetails',
      props: true,
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-main-details" */ '@/views/admin/requests/UserEventDetails.vue'
        ),
    },
    {
      path: '/admin/request/assess',
      name: 'requestAssess',
      props: true,
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-main-details" */ '@/views/admin/requests/RequestAssess.vue'
        ),
    },
    /**
      |--------------------------------------------------
      | Logs (admin)
      |--------------------------------------------------
   */
    // Mail logs
    {
      path: '/admin/logs/mail',
      name: 'mailLogs',
      props: true,
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-main-details" */ '@/views/admin/logs/mail/Main.vue'
        ),
    },

    // Login, logout
    {
      // https://paco-1a08b.firebaseapp.com/home?mode=resetPassword&oobCode=tRiYs5S8Ry5pwQrd7SH5-qQr9Zlv7Hkg2yzX9HyQyhIAAAF6-Fh59g&apiKey=AIzaSyAge4gR03bNsbvhOtyRSuw4qtGBgE4pX_U&lang=es-419
      path: '/resetPassword',
      name: 'resetPassword',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-main-details" */ '@/views/ResetPassword.vue'
        ),
      props: true,
      meta: {
        authNotRequired: true,
      },
    },

    {
      path: '/userEdit',
      name: 'userEdit',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-main-details" */ '@/views/userEdit/UserEdit.vue'
        ),
      props: true,
      meta: {
        authNotRequired: false,
      },
    },
    {
      path: '/academicProfile',
      name: 'academicProfile',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-main-details" */ '@/views/academicProfile/AcademicProfile.vue'
        ),
    },
    {
      path: '/messages',
      name: 'messages',
      component: () =>
        import(
          /* webpackChunkName: "client-chunk-main-details" */ '@/views/messages/Messages.vue'
        ),
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
  if (!isNil(to.query)) {
    const { mode, oobCode, lang, apiKey } = to.query
    if (mode === 'resetPassword') {
      return router.push({
        name: 'resetPassword',
        params: {
          resetActionCode: oobCode,
          resetLang: lang,
          resetKey: apiKey,
        },
      })
    }
  }

  // TODO Create handleResetPassword 202107.30-16.28
  // TODO Add store action to use firebase an call auth.confirmPasswordReset 202107.30-12.06
  if (
    !(to.meta && to.meta.authNotRequired) &&
    isNil(store.state.authentication.user)
  ) {
    const path =
      store.state.authentication.user === null ? '/home' : '/check-login'
    return next(`${path}?redirectUrl=${to.path}`)
  }

  // To ensure the user completes her registration
  // TODO get the claims for the user
  // TODO set some snackbar/toast to inform the incompleteness
  // TODO push the route to the new complete user form

  return next()
})

export default router
