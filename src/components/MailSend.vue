<script>
/**
 * @typedef {object} MailComponent
 * @vue-data {import('src/typedefs').Mail} mailData - A mail
 * @vue-prop {string} cc - The cc
 * @vue-prop {string} message - The message
 * @vue-prop {string} subject - The subject
 * @vue-prop {string} to - The email address
 * @vue-prop {boolean} button - Whether to show the button
 */

import { mapActions } from 'vuex'
import createMail from '@/classes/Mail'

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
    bcc: {
      type: String,
      required: false,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    templateName: {
      type: String,
      required: false,
      default: 'default',
    },
    username: {
      type: String,
      required: false,
    },
    button: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {}
  }, // data
  computed: {
    // This is going to become a Mail object created with the proper factory function
    /** @return {import('src/typedefs').Mail} mailData - A mail*/
    mailData() {
      return createMail({
        to: this.to,
        cc: this.cc,
        bcc: this.bcc,
        template: {
          message: this.message,
          name: this.templateName,
          username: this.username,
        },
      })
    }, // mailData
  },
  methods: {
    ...mapActions('admin', ['sendMail']),
    showPreview: function () {
      console.log('preview', this.mailData.showPreview())
    },
  },
}
</script>
<template>
  <v-tooltip v-if="button" right color="primary">
    <template v-slot:activator="{ on, attrs }">
      <v-icon dark v-bind="attrs" v-on="on" @click="showPreview">
        mdi-email-arrow-right
      </v-icon>
    </template>
    <span>Enviar correo electrónico a: {{ mailData.showPreview }}</span>
  </v-tooltip>
</template>
