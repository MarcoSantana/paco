<template>
  <v-container>
    <v-card flat color="transparent" light>
      <v-card-title primary-title>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>
              Documentos pendientes
              <template v-slot:actions>
                <v-badge
                  color="red"
                  class="mx-3 mt-2"
                  :content="pendingDocuments.length"
                ></v-badge>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-card-text>
                <v-list two-line>
                  <v-list-item
                    v-for="document in pendingDocuments"
                    :key="document.id"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $t(`document.types.${document.name}`) | capitalize }}
                      </v-list-item-title>
                      <v-list-item-subtitle class="caption">
                        {{ document.updateTimestamp | toLocaleDateString }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-title>
    </v-card>
  </v-container>
</template>
<script lang="js">
//@ts-check

import { mapActions, mapState, mapGetters, mapMutations} from 'vuex'
import capitalize from '@/filters/capitalize'
import toLocaleDateString from '@/filters/toLocaleDateString'

export default {
    name: 'ListUserDocuments', // mounted
    components: {}, // components
    filters: { capitalize, toLocaleDateString }, // filters
    props: {
        user: { type: Object, required: true},
        // TODO add tag
    }, // props
    computed: {
      ...mapState('documents', ['documents']),
      ...mapGetters('documents', ['pendingDocuments']),
    }, //computed
    mounted: function() {
      this.resetDocuments
      this.getUserDocumentsById(this.user.id)
    }, // mounted
    methods: {
        ...mapActions('documents', [
            'getUserDocumentsById'
        ]),
       ...mapMutations('documents', ['resetDocuments'])
    }, // methods
}
</script>
