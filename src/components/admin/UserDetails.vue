<template>
  <v-list-item>
    <v-list-item-icon class="mx-0 pa-0">
      <!-- TODO add tooltip 202207.01-04.31 -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-if="user.incomplete" color="pink" v-bind="attrs" v-on="on">
            mdi-heart-broken-outline
          </v-icon>
        </template>
        <span>{{ $t('messages.incompleteData') | capitalize }}</span>
      </v-tooltip>
    </v-list-item-icon>
    <v-list-item-icon class="mx-0 pa-0">
      <v-icon v-if="templateUser.status == 'pending'" color="red">
        mdi-email
      </v-icon>
    </v-list-item-icon>
    <v-list-item-content class="ml-2">
      <v-list-item-title>
        {{ user.displayName | capitalize }}
      </v-list-item-title>
    </v-list-item-content>

    <v-list-item-avatar>
      <!-- Add avatar if no photo-->
      <v-img v-if="user && user.photoURL" :src="user.photoURL"></v-img>
    </v-list-item-avatar>
  </v-list-item>
</template>

<script>
import GenericDB from '@/firebase/generic-db'
import capitalize from '@/filters/capitalize'

export default {
  name: 'UserDetails',
  filters: { capitalize },
  props: {
    text: String,
    templateUser: Object,
  },
  data() {
    return {}
  },
  asyncComputed: {
    async user() {
      const usersDB = new GenericDB('users')
      return usersDB.read(this.templateUser.userId)
    },
  },
}
</script>

<style></style>
