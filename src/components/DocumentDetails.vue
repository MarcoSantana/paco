<template>
  <v-container>
    <v-card class="pa-3">
      <v-card-title>
        <h1 class="text-capitalize text-h4">{{$t(`document.types.${document.name}`)}}</h1>
        <ul>
          <h2>TODO</h2>
          <li>dialog to show full size</li>
          <li>More details</li>
          <li>Mark updated document for review</li>
        </ul>
      </v-card-title>
      <v-card-text v-for="(file, i) in docURLs" :key="file">
        <show-file :url="file" @removeFile="file = null" />
        <validation-provider
          v-if="document.status ===3"
          v-slot="{ errors }"
          inmediate
          :name="document.name"
          rules="required|size:2000"
        >
          <v-file-input
            :key="`${document.name}-file-input`"
            :ref="`fileInput-${i}`"
            v-model="files[i]"
            :name="`fileInput-${document.name}-${i}`"
            :data-vv-as="`file-${i - 1}`"
            accept="image/png, image/jpeg, application/pdf"
            :placeholder="`${$t('actions.load')} ${$t('document.types.' + document.name)} ${i + 1}`"
            :error="errors.length > 0"
            :error-messages="errors[0]"
            counter
            chips
            show-size
            truncate-length="15"
            required
            small-chips
            clearable
            @click="setDocumentCreationMessage({})"
            @change="docURLs[i - 1] = getURL(files[i - 1])"
          >
            <v-icon
              slot="append"
              color="red"
              @click="
                  delete docURLs[i - 1]((inputsArray[i - 1] = false))(
                    filesCounter - 1 < 1
                      ? (filesCounter = 1)
                      : (filesCounter -= 1)
                  )
                "
            >mdi-minus</v-icon>
          </v-file-input>
        </validation-provider>
      </v-card-text>
      <v-card-actions v-if="document.status === 3">
        <v-btn
          v-if="documentCreationMessage.type !== 'success'"
          class="my-2"
          color="success"
          :disabled="invalid"
          @click="validate()"
        >
          {{ $t('actions.save') }}
          <v-icon right dark>mdi-cloud-upload</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { isNil } from 'lodash'
import { mapState } from 'vuex'
import { storage } from 'firebase'
import ShowFile from '@/components/ShowFile'

export default {
  name: 'DocumentDetail',
  components: { ShowFile },
  props: {
    document: Object,
  },
  data() {
    return {
      docURLs: [],
      fieldModel: [],
      files: [],
      filesCounter: 1,
    }
  },
  mounted() {
    console.log('Document detail', this.document)
    this.$nextTick(() => {
      this.populateRemoteFiles(this.documentFiles)
    })
  },
  methods: {
    populateRemoteFiles(files) {
      if (isNil(files)) return null
      return files.map(async (file) => {
        this.docURLs.push(await this.getDownloadURL(file))
      })
    },

    async getDownloadURL(docRef) {
      const storageRef = storage().ref(docRef)
      const url = await storageRef.getDownloadURL()
      return url
    },
  },
  computed: {
    ...mapState('documents', ['documentCreationMessage']),
    documentFiles() {
      return Object.values(this.document.files)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.document-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
