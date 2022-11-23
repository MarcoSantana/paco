<script>
/**
 * @typedef {object} MailComponent
 * @vue-data {import('src/typedefs').Mail} mailData - A mail
 * @vue-prop {String} cc - The cc
 * @vue-data {String} message - The message
 * @vue-data {String} subject - The subject
 * @vue-prop {String} to - The email address
 * @vue-prop {Boolean} button - Whether to show the button
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
    // subject: {
    //   type: String,
    //   required: true,
    // },
    // message: {
    //   type: String,
    //   required: true,
    // },
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
    return {
      message: '',
      dialog: false,
      preview: false,
    }
  }, // data
  asyncComputed: {
    mailPreview() {
      if (this.preview) return this.mailData.showPreview()
    },
  }, // asyncComputed
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
    showPreview: async function () {
      console.log('preview', await this.mailData.showPreview())
    },
    cancel: function () {
      this.message = ''
      this.preview = false
      this.dialog = false
    },
  },
}
</script>
<template>
  <v-container>
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary lighten-3" dark v-bind="attrs" v-on="on">
          <v-icon dark v-bind="attrs" v-on="on" @click="dialog">
            mdi-email-arrow-right
          </v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-1">
          Mensaje para:
          <div>{{ to }}</div>
        </v-card-title>

        <v-card-text>
          <v-textarea
            v-model="message"
            name="message"
            label="Texto del mensaje"
          ></v-textarea>
        </v-card-text>
        {{/* eslint-disable-next-line vue/no-v-html  */}}
        <div v-html="mailPreview"></div>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="error" text @click="cancel">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="preview = true">I accept</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
