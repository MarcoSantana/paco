<template>
  <v-layout row wrap>
    <v-flex xs12 class="pa-3">
      <v-card
        color="grey darken-2"
        class="white--text"
        width="100%"
        height="auto"
        dark
      >
        <v-layout row>
          <v-flex xs7>
            <v-card-title>
              <div v-if="user.email" class="text-downcase subtitle-2 ml-5 mt-5">
                {{ user.email }}
              </div>
              <div
                v-if="user.phoneNumber"
                class="text-downcase subtitle-2 ml-5 mt-5"
              >
                {{ user.phoneNumber }}
              </div>
            </v-card-title>
          </v-flex>
          <v-flex xs5 class="pl-5">
            <v-badge overlap color="error" class="ma-5">
              <template
                v-if="user.incomplete == undefined || user.incomplete"
                v-slot:badge
                class="pb-1"
              >
                <v-icon>mdi-alert</v-icon>
              </template>
              <v-avatar :color="randomColor" size="62">
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
            </v-badge>
          </v-flex>
        </v-layout>
        <v-divider dark />
        <v-row dense>
          <v-col cols="12">
            <v-card color="#385F73" dark>
              <v-card-title class="text-h5">
                Datos personales
              </v-card-title>

              <v-card-subtitle>
                Listen to your favorite artists and albums whenever and
                wherever, online and offline.
              </v-card-subtitle>
              <v-card-text>
                <v-list color="#385F73">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Nombre</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-row>
                          <v-col cols="4">
                            {{ currentUser.name }}
                          </v-col>
                          <v-col cols="4">
                            {{ currentUser.lastname1 }}
                          </v-col>
                          <v-col cols="4">
                            {{ currentUser.lastname2 }}
                          </v-col>
                        </v-row>
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
                </v-list>
              </v-card-text>

              <v-card-actions>
                <v-btn text>
                  Listen Now
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <!-- <v-card-text v-if="currentUser.profile"> -->
        <!--   <div v-for="record in currentUser.profile" :key="record.id"> -->
        <!--     <div -->
        <!--       v-for="(value, name) in record" -->
        <!--       :key="`${name}-${record.documentName}`" -->
        <!--     > -->
        <!--       <div> -->
        <!--         <div -->
        <!--           v-if="name !== 'documentName'" -->
        <!--           class="subtitle-1 text-capitalize" -->
        <!--         > -->
        <!--           {{ value }} -->
        <!--         </div> -->
        <!--         <p -->
        <!--           v-if="name !== 'documentName' || name !== 'curp'" -->
        <!--           class="text-lowercase subtitle-2" -->
        <!--         > -->
        <!--           {{ $t(`academicProfile.${record.documentName}.${name}`, {}) }} -->
        <!--         </p> -->
        <!--       </div> -->
        <!--     </div> -->
        <!--     <v-divider /> -->
        <!--   </div> -->
        <!-- </v-card-text> -->
        <v-card-actions class="pa-3"></v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'UserShowDialog',
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
