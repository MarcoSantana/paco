import Vue from 'vue'
import Vuex from 'vuex'
import admin from './admin'
import app from './app'
import authentication from './authentication'
import colleges from './colleges'
import documents from './documents'
import events from './events'
import forms from './forms'
import hospitals from './hospitals'
import products from './products'
import user from './user'

Vue.use(Vuex)

/* If you don't know about Vuex, please refer to https://vuex.vuejs.org/ */

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    admin,
    app,
    authentication,
    colleges,
    documents,
    events,
    forms,
    hospitals,
    products,
    user,
  },
})
