<template>
  <v-card v-if="user">
    <v-card-title>
      <v-row>
        <v-col cols="2">
          <v-img v-if="user.photoURL" :src="user.photoURL" />
          <!-- todo add random generated bg color to avatar -->
          <v-img
            v-else
            :src="
              `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user.displayName}`
            "
          ></v-img>
        </v-col>
      </v-row>
      {{ user.displayName | capitalize }}
    </v-card-title>
    <v-card-text>
      <v-list v-if="documents" dense>
        <v-list-item v-for="document in documents" :key="document.id">
          <v-list-item-content>
            <show-document
              v-if="document && document.files && document.files.length"
              :id="document.id"
              :document="document"
              :title="true"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { cloneDeep } from 'lodash'
import capitalize from '@/filters/capitalize'
import ShowDocument from '@/components/admin/ShowDocument.vue'

export default {
  name: 'RequestAssess',
  filters: { capitalize },
  components: {
    ShowDocument,
  },
  props: {
    userData: { type: Object, required: true },
  },
  data: () => ({}),
  asyncComputed: {
    documents() {
      const files = Object.keys(this.userData.documents).map(key => {
        return this.userData.documents[key].files
      })
      return { ...cloneDeep(this.user.documents), files }
    },
  },
  computed: {
    user() {
      return cloneDeep(this.userData)
    },
  },
  mounted() {}, // end of computed
  methods: {}, // end of methods
}
</script>

<style lang="scss" scoped></style>
