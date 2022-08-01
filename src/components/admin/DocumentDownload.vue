<template>
  <v-sheet>
    <v-btn text @click="downloadDocument">
      <v-icon class="mr-2">mdi-cloud-download</v-icon>
      {{ $t('actions.download') }}
    </v-btn>
    <v-snackbar v-if="message" v-model="snackbar">
      {{ message.message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="error" text v-bind="attrs" @click="snackbar = false">
          {{ $('actions.close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-sheet>
</template>

<script>
// @ts-check
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import Message from '@/classes/Message'

/**
 * Downloads the file as a JZip folder
 * @param {string} url
 * @returns {DownloadedFile}
 */

export default {
  /**
   * @typedef {File[]|void} DownloadedFile
   * @property {JSZip} folder - A JSZip folder with files
   */
  components: {}, // components
  props: {
    document: { type: Object, required: true },
    urls: { type: Array, required: true },
    user: { type: Object, required: true },
  }, // props
  data: () => ({
    /** @type {Message} */
    message: null,
    /** @type boolean */
    snackbar: false,
    /** @type any */
    temp: null, // temporal use
  }),
  computed: {}, // computed
  asyncComputed: {}, // asyncComputed
  methods: {
    /**
     * Compresses the zipFiles
     * @param {Blob[]} files
     * @returns {Promise<JSZip>} - A Zip file
     */
    async compressFile(files) {
      const zip = new JSZip()
      const zipFiles = zip.folder('archivos')
      zip.file(
        `${this.user.license ? this.user.license : this.user.displayName}-${
          this.document.name
        }.txt`,
        `Nombre del documento: ${this.$t(
          `document.types.${this.document.name}`
        )},\nUsuario: ${
          this.user.displayName
        },\nFecha de descarga: ${new Date().toLocaleString(
          'es-MX'
        )}\nCantidad de archivos: ${files.length}`
      )
      files.forEach(item => {
        zipFiles.file(
          `${this.user.license ? this.user.license : this.user.displayName}-${
            this.document.name
          }`,
          item,
          {
            base64: true,
          }
        )
      })
      // @ts-ignore
      return zip
        .generateAsync({ type: 'blob' })
        .then(/** @type Promise<JSZip> */ res => res)
        .catch(err =>
          this.showMessage(
            new Message({
              type: 'error',
              message: `Error al comprimir el archivo, intente de nuevo más tarde: ${err}`,
            })
          )
        )
    }, // compressFile

    /**
     * Downloads the document for the user to save
     */
    async downloadDocument() {
      this.$emit('start')
      const files = await Promise.all(
        this.urls.map(async (/** @type {string} */ url) => {
          const res = this.getFile(url)
          return res
        })
      )
      const compressedFile = await this.compressFile(files)
      const res = this.save(compressedFile)
      this.showMessage(new Message(res))

      this.$emit('end')
    }, // downloadDocument

    /**
     * Downloads the file as a JZip folder
     * @param {string} url
     * @throws {Error}
     * @returns {Promise<Blob>} - A JSZip file
     */
    async getFile(url) {
      // eslint-disable-next-line consistent-return
      return fetch(url).then(response => {
        try {
          if (!response.ok) {
            throw new Error('Network response was not OK')
          }
          return response.blob()
        } catch (err) {
          this.showMessage(
            new Message({
              type: 'error',
              message: 'Hubo un error en la descarga del archivo',
            })
          )
        }
      })
    }, // getFile

    /**
     * Triggers file download from client end
     * @param {*} compressedFile
     */
    save(compressedFile) {
      saveAs(
        compressedFile,
        `${this.user.license ? this.user.license : this.user.displayName}-${
          this.document.name
        }.zip`
      )
        // @ts-ignore
        .then(() => {
          return new Message({
            message: 'Éxito al descargar archivo',
            type: 'success',
          })
        })
        .catch(err => {
          console.error(err)
          return new Message({
            type: 'sccess',
            message: 'Error al descargar archivo',
          })
        })
    }, // save

    /**
     * Displays snackbar with {@link Message}
     * @param {Message} message
     */
    showMessage(message) {
      this.message = message
      this.snackbar = true
      // TODO set a timeout to auto dismiss
    },
  }, // methods
}
</script>

<style></style>
