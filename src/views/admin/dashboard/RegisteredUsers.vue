<template>
  <v-sheet>
    <v-card v-if="registeredUsers" class="d-flex flex-column" max-width="400" height="400">
      <v-card-title>
        <v-icon large left>mdi-file-multiple</v-icon>
        <span class="text-h6 font-weight-light text-capitalize">{{ $t('registeredUsers') }}</span>
      </v-card-title>
      <v-spacer></v-spacer>
      <v-card-text class="text-h5 font-weight-bold" style="height: 200;">
        <p class="text-h1 text-center">{{ registeredUsers.count }}</p>
        <p
          class="caption text-center text-capitalize"
        >{{ $t('lastRecord') }} {{ registeredUsers.updateTimestamp | intlDate }}</p>
      </v-card-text>
      <v-spacer></v-spacer>
    </v-card>
    <v-skeleton-loader v-else class="d-flex flex-column" max-width="400" height="400" type="card"></v-skeleton-loader>
  </v-sheet>
</template>
<script>
import CountersDB from '@/firebase/counters-db'
import intlDate from '@/filters/intlDate'

export default {
  filters: { intlDate },
  data: () => ({}),
  asyncComputed: {
    async registeredUsers() {
      const counter = await new CountersDB().registeredUsers()
      console.log('registeredUsers', counter)
      return counter
    },
  },
}
</script>
