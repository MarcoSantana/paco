import Vue from 'vue'
import Vuex from 'vuex'
import authentication from './authentication'
import app from './app'
import products from './products'
import documents from './documents'
import colleges from './colleges'
import hospitals from './hospitals'
import forms from './forms'
import admin from './admin'
import events from './events'

Vue.use(Vuex)

/* If you don't know about Vuex, please refer to https://vuex.vuejs.org/ */

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    authentication,
    app,
    products,
    colleges,
    documents,
    hospitals,
    forms,
    admin,
    events,
  },
})
