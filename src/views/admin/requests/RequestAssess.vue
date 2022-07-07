<template>
  <v-card v-if="user">
    <v-card-actions class="pa-3">
      <v-spacer />
      <v-menu v-model="menu" ...>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-plus</v-icon>
            <v-icon v-if="menu">mdi-menu-up</v-icon>
            <v-icon v-else>mdi-menu-up</v-icon>
          </v-btn>
        </template>
      </v-menu>
      <v-spacer />
      <template>
        <v-speed-dial v-model="fab" direction="left" transition="slide-x-reverse-transition">
          <template v-slot:activator>
            <v-hover v-slot="{ hover }">
              <v-btn v-model="fab" color="blue darken-2" dark :fab="!hover" :x-large="hover">
                <span v-if="hover && !fab">Acciones de la solicitud</span>
                <v-icon v-if="fab">mdi-close</v-icon>
                <v-icon v-else>mdi-hammer-wrench</v-icon>
              </v-btn>
            </v-hover>
          </template>

          <v-btn fab dark small color="green">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn fab dark small color="indigo">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          <v-btn fab dark small color="red">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-speed-dial>
      </template>
    </v-card-actions>
    <v-card-title>
      <v-row>
        <v-col cols="2">
          <v-img v-if="user.photoURL" :src="user.photoURL" />
          <!-- todo add random generated bg color to avatar  -->
          <v-img
            v-else
            max-width="100px"
            width="100px"
            :src="
              `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user.displayName}`
            "
          ></v-img>
        </v-col>
      </v-row>
      <span class="text-h3">{{ user.displayName | capitalize }}</span>
      <v-spacer />
      <!--  -->
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
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" text>
        <v-icon>mdi-arrow-left</v-icon>
        {{ $t('actions.back') }}
      </v-btn>
      <v-tooltip top color="primary">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
          <v-spacer />
        </template>
        <span>Acciones de documento</span>
      </v-tooltip>
    </v-card-actions>
  </v-card>
</template>

<script lang="js">
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
  data: () => ({ fab: false }),
  asyncComputed: {
    documents() {
      const files = Object.keys(this.userData.documents).map(key => {
        return this.userData.documents[key].files
      })
      return { ...cloneDeep(this.user.documents), files }
    }, // end documents
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

<style>
.v-speed-dial {
  position: absolute;
}
.v-btn--floating {
  position: relative;
}
</style>
