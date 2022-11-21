<script>
// @ts-check

/**
 * @typedef {object} MailComponent
 * @vue-data {import('src/typedefs').Mail} mailData - A mail
 * @vue-prop {string} to - The email address
 * @vue-prop {string} subject - The subject
 * @vue-prop {string} body - The body
 * @vue-prop {string} cc - The cc
 */

import { mapActions } from 'vuex'

export default {
  name: 'Mail',
  props: {
    to: {
      type: String,
      required: true,
    },
    cc: {
      type: String,
      required: false,
    },
  },
  data() {
    return {}
  }, // data
  computed: {
    /** @return {import('src/typedefs').Mail} mailData - A mail*/
    mailData() {
      return { to: 'some string' }
    },
  },
  methods: {
    ...mapActions('admin', ['sendMail']),
  },
}
</script>
<template>
  <v-container grid-list-xs>Me be mail component</v-container>
</template>
