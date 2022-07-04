<template>
  <v-card v-if="user">
    <v-card-title>
      <v-row>
        <v-col cols="2">
          <v-img v-if="user.photoURL" :src="user.photoURL" />
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
      docULRs{{ docURLs }}
      <v-list v-if="documents" dense>
        <v-list-item v-for="document in documents" :key="document.id">
          <template>
            <v-card max-width="800" height="auto" class="mx-auto">
              <v-img
                src="https://cdn.vuetifyjs.com/images/lists/ali.png"
                height="100%"
                dark
              >
                <upload-document
                  v-if="document && document.files"
                  :document="document"
                  :show-files="document.files"
                ></upload-document>
                <v-row class="fill-height">
                  <v-card-title>
                    <v-btn dark icon>
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>

                    <v-spacer></v-spacer>

                    <v-btn dark icon class="mr-4">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn dark icon>
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-spacer></v-spacer>

                  <v-card-title class="white--text pl-12 pt-12">
                    <div class="text-h4 text-center pl-12 pt-12"></div>
                  </v-card-title>
                </v-row>
              </v-img>
            </v-card>
          </template>
          <show-file
            v-for="(file, i) in docURLs"
            :key="`url-${i}-${inputsArray[i - 1]}`"
            :url="file"
            @removeFile="file = null"
          />
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { isNil, cloneDeep } from 'lodash'
import capitalize from '@/filters/capitalize'
import { storage } from 'firebase'
import UploadDocument from '@/components/UploadDocument.vue'
import ShowFile from '@/components/ShowFile.vue'

export default {
  name: 'RequestAssess',
  filters: { capitalize },
  // components: { ShowFile },
  components: { UploadDocument, ShowFile },
  props: {
    userData: { type: Object, required: true },
  },
  data: () => ({
    docURLs: [],
  }),
  asyncComputed: {
    async documents() {
      if (isNil(this.userData.documents)) return null
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
  mounted() {
    this.$nextTick(async () => {
      console.log('RequestAssess mounted')
      await this.populateRemoteFiles(this.userData.documents)
      // this.getDocURLs()
    })
    // console.clear()
  }, // end of computed
  methods: {
    async getDownloadURL(docRef) {
      // docRef =
      //   '/documents/QeJX1lgfKPgyqpKLd4KvsNGOvWr2/Q8CRtJotYm2XqY6pbfgz/degreeDiploma-0'
      // const fileName = docRef.split('/').pop()
      // console.log('docRef', docRef)
      // console.log('fileName', fileName)
      const storageRef = storage().ref(docRef)
      const url = await storageRef.getDownloadURL()
      return url
      // return storageRef
    },

    async populateRemoteFiles(files) {
      // if (isNil(files)) return null
      const localFiles = [...files]
      debugger
      console.clear()
      console.log('Array.isArray(files)', Array.isArray(files))
      console.log('Array.isArray(localFiles)', Array.isArray(localFiles))
      console.log('localFiles', localFiles)
      // localFiles.map(async file => {
      //   debugger
      //   console.log('populateRemoteFiles file', file)
      //   this.docURLs.push(await this.getDownloadURL(file))
      //   console.table(this.docURLs)
      //   /* await this.getDownloadURL(file) */
      // })
      return this.docURLs
    },
  }, // end of methods
}
</script>

<style lang="scss" scoped></style>
