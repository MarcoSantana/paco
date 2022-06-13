<template>
  <v-card class="mx-auto" max-width="500">
    <v-alert
      v-if="documentCreationMessage.message"
      text
      :type="documentCreationMessage.type"
    >
      {{ documentCreationMessage.message }}
    </v-alert>
    <validation-observer v-slot="{ invalid }">
      <v-card-text class="ma-5">
        <div v-for="field in document.fields" :key="field.name" class="pr-5">
          <keep-alive>
            <validation-provider
              v-slot="{ errors }"
              :name="field.name"
              :rules="field.rules"
            >
              <span :class="{ error: errors[0] }">
                <component
                  :is="field.type"
                  :ref="field.name"
                  v-model="fieldModel[field.name]"
                  :name="field.name"
                  :schema="{ ...field }"
                  :data-vv-name="scope"
                  :label="$t('document.' + field.label)"
                  :placeholder="field.placeholder"
                  :error="errors.length > 0"
                  :error-messages="errors"
                  :counter="field.counter"
                  @input="input($event, field)"
                ></component>
              </span>
            </validation-provider>
          </keep-alive>
        </div>
      </v-card-text>
      <v-card-text>
        <show-file
          v-for="(file, i) in docURLs"
          :key="`url-${i}-${inputsArray[i - 1]}`"
          :url="file"
          @removeFile="file = null"
        />
        <keep-alive v-for="item in filesCounter" :key="`input-${item - 1}`">
          <validation-provider
            v-slot="{ errors }"
            inmediate
            :name="`file-${document.name}-${item - 1}`"
            rules="required|size:2000"
          >
            <v-file-input
              :key="`${document.name}-${item - 1}-${inputsArray[item - 1]}`"
              :ref="`fileInput-${item - 1}`"
              v-model="files[item - 1]"
              :name="`foo-${document.name}-${item - 1}`"
              :data-vv-as="`file-${item - 1}`"
              :data-vv-name="scope"
              accept="image/png, image/jpeg, application/pdf"
              :placeholder="document.placeholder"
              :error="errors.length > 0"
              :error-messages="errors[0]"
              counter
              chips
              show-size
              truncate-length="15"
              :required="document.required"
              small-chips
              clearable
              @click="setDocumentCreationMessage({})"
              @change="docURLs[item - 1] = getURL(files[item - 1])"
            >
              <v-icon
                slot="append"
                color="red"
                @click="
                  delete docURLs[item - 1]((inputsArray[item - 1] = false))(
                    filesCounter - 1 < 1
                      ? (filesCounter = 1)
                      : (filesCounter -= 1)
                  )
                "
              >
                mdi-minus
              </v-icon>
            </v-file-input>
          </validation-provider>
        </keep-alive>
        <v-card-text class="text-right">
          <v-btn
            class="pa-5"
            fab
            dark
            small
            color="pink"
            @click="
              inputsArray[filesCounter] = true
              filesCounter += 1
            "
          >
            <v-icon dark>mdi-plus</v-icon>
          </v-btn>
        </v-card-text>
        <v-card-actions>
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
      </v-card-text>
    </validation-observer>
  </v-card>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { storage } from 'firebase'
import { isNil } from 'lodash'
import ShowFile from '@/components/ShowFile'
import FieldUniversity from '@/components/forms/fieldUniversity'
import CommentField from '@/components/forms/CommentField'

export default {
  components: { CommentField, ShowFile, FieldUniversity },
  props: {
    document: {
      type: Object,
      required: true,
    },
    showFiles: {
      type: Array,
      required: false,
    },
    scope: { type: String, required: false },
  },
  data: () => ({
    docURLs: [],
    email: null,
    error: {},
    fieldModel: {},
    files: [],
    filesCounter: 1,
    firstName: null,
    foo: null,
    inputsArray: [true],
    lastName: null,
  }),

  asyncComputed: {
    // TODO I commented this out because it was causing a bug
    // this methiod is called to load preexisting files
    // files() {
    //   return !isNil(this.showFiles)
    //     ? Object.values(this.showFiles).forEach(async url => {
    //         await fetch(url)
    //         // const res = await fetch(url)
    //         // if (res.status === 403) return null
    //         // return res
    //       })
    //     : null
    //   // TODO: manage 403 error in fetch
    // },
  },
  computed: {
    ...mapState('documents', [
      'documents',
      'documentNameToCreate',
      'documentCreationPending',
      'documentCreationMessage',
    ]),
  },
  mounted() {
    this.setDocumentCreationMessage({})
    this.populateRemoteFiles(this.showFiles)
  },
  methods: {
    ...mapActions('documents', [
      'createUserDocument',
      'upsertUserDocument',
      'triggerAddDocumentAction',
    ]),
    ...mapActions('events', ['updateUserEvent']),
    ...mapMutations('documents', [
      'setDocumentNameToCreate',
      'setDocumentCreationMessage',
    ]),
    getURL(file) {
      console.log('getURL', file)
      if (isNil(file) || typeof file !== 'object') return null
      return URL.createObjectURL(file)
    },
    async createLocalDocument(document) {
      if (isNil(document) || isNil(this.files)) {
        this.valid = false
        return {}
      }
      const createdDocument = await this.upsertUserDocument(document)
      console.trace('createdDocument', createdDocument)
      return createdDocument
    },
    async validate() {
      if (!this.valid && this.invalid) return null
      this.setDocumentCreationMessage({
        type: 'info',
        message: 'Validando documento',
      })
      this.setDocumentCreationMessage({
        type: 'warning',
        message: 'Creando documento',
      })
      const createdDocument = await this.createLocalDocument({
        name: this.document.name,
        info: this.fieldModel,
        upload: this.files,
      })
      this.$emit('document-created', createdDocument)
      return true
    },
    async getDownloadURL(docRef) {
      const storageRef = storage().ref(docRef)
      const url = await storageRef.getDownloadURL()
      return url
    },

    populateLocalFiles(files) {
      if (isNil(files)) return null
      console.log('files: ', files)
      return files.map(file => this.getURL(file))
    },

    populateRemoteFiles(files) {
      if (isNil(files)) return null
      console.log('populateRemoteFiles', files)
      return files.map(async file => {
        this.docURLs.push(await this.getDownloadURL(file))
      })
    },
    clearFileInput(index) {
      // console.log('refs', this.$refs[`fileInput-${index}`][0].$el)
      const element = this.$refs[`fileInput-${index}`][0]
      console.log('element: ', element)
      this.$delete(element)
      this.$destroy(element)
    },
    input(e, field) {
      console.log('input', field)
      console.log('event', e)
      this.fieldModel[field.name] = e
      console.log('fieldModel', this.fieldModel)
    },
  },
}
</script>
