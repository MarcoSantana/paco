<template>
  <v-layout row wrap>
    <v-flex xs12 class="pa-3">
      <v-card
        color="secondary darken-2"
        class="white--text"
        width="auto"
        height="auto"
      >
        <v-layout col>
          <v-flex xs7>
            <v-card-title class="text-h5">Datos personales</v-card-title>
            <v-list color="secondary darken-2" dark>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Nombre</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ currentUser.name }}
                    {{ currentUser.lastname1 }}
                    {{ currentUser.lastname2 }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Datos de contacto</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ currentUser.phoneNumber }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Cédula profesional</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ user.license }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Correo electrónico</v-list-item-title>
                  <v-list-item-subtitle v-if="user.email" class="text-downcase">
                    {{ user.email }}
                    <v-tooltip right color="primary">
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon dark v-bind="attrs" v-on="on">
                          mdi-email-arrow-right
                        </v-icon>
                      </template>
                      <span>Enviar correo electrónico</span>
                    </v-tooltip>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Teléfono</v-list-item-title>
                  <v-list-item-subtitle
                    v-if="user.phoneNumber"
                    class="text-downcase"
                  >
                    {{ user.phoneNumber }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-flex>
          <v-flex xs3 class="pt-5 pl-5 pr-5">
            <v-avatar :color="randomColor" size="128">
              <v-img
                v-if="user.photoURL"
                max-height="125px"
                max-width="125px"
                :src="user.photoURL"
              />
              <span v-else class="white--text text-h5">
                {{ user.name[0] }}{{ user.lastname1[0] }}
              </span>
            </v-avatar>
          </v-flex>
        </v-layout>
        <v-divider dark />
        <v-row dense>
          <v-col cols="12">
            <v-card color="#003148" dark>
              <v-card-title>Información</v-card-title>
              <v-card-text>
                <list-user-documents :user="currentUser"></list-user-documents>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-card-actions class="pa-3"></v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import ListUserDocuments from '@/components/admin/documents/ListUserDocuments'

export default {
  name: 'UserShowDialog',
  components: { ListUserDocuments },
  props: {
    user: { type: Object, required: true },
  },
  computed: {
    ...mapState('admin', ['currentUser']),
    localUser() {
      return this.currentUser
    },
    randomColor() {
      const letters = '0123456789ABCDEF'
      let color = '#'
      for (let i = 0; i < 6; i += 1)
        color += letters[Math.floor(Math.random() * 16)]
      return color
    }, // randomColor
  }, // computed
  watch: {
    async user(newVal, oldVal) {
      if (oldVal.id !== newVal.id)
        await this.triggerSetCurrentUserWithProfile(newVal.id)
    }, // user
  }, // watch

  async beforeMount() {
    // await this.setCurrentUser(this.user)
    await this.triggerSetCurrentUserWithProfile(this.user.id)
  },
  async mounted() {
    // await this.setCurrentUser(this.user)
    // await this.triggerSetCurrentUserWithProfile(this.user.id)
  }, // mounted

  methods: {
    ...mapActions('admin', ['triggerSetCurrentUserWithProfile']),
  }, // method
}
</script>
<style scoped>
.name {
  white-space: pre-wrap;
  word-break: keep-all; /*this stops the word breaking*/
  text-transform: capitalize;
}
</style>
