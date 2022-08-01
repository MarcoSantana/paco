<template>
  <span>
    <span @click="downloadDocument">
      <slot name="activator"></slot>
    </span>
  </span>
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
    tag: { type: String, default: 'v-sheet' },
    urls: { type: Array, required: true },
    user: { type: Object, required: true },
  }, // props
  data: () => ({
    /** @type {Message} */
    message: null,
    /** @type boolean */
    snackbar: false,
  }),
  computed: {}, // computed
  asyncComputed: {}, // asyncComputed
  methods: {
    onClick() {
      console.log('click')
      this.downloadDocument()
    },
    /**
     * Compresses the zipFiles
     * @param {Blob[]} files
     * @returns {Promise<JSZip>} - A Zip file
     */
    async compressFile(files) {
      const zip = new JSZip()
      const zipFiles = zip.folder('archivos')
      zip.file(
        `${
          this.user.license ? this.user.license : this.user.displayName
        }-${this.$t(`document.types.${this.document.name}`)}.txt`,
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
          `${
            this.user.license ? this.user.license : this.user.displayName
          }-${this.$t(`document.types.${this.document.name}`)}
          `,
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
      this.showMessage(
        new Message({ type: 'info', message: 'Inicia la descarga' })
      )
      const files = await Promise.all(
        this.urls.map(async (/** @type {string} */ url) => {
          const res = this.getFile(url)
          return res
        })
      )
      const compressedFile = await this.compressFile(files)
      const res = this.save(compressedFile)
      console.log('res', res)
      this.showMessage(new Message(res))

      this.showMessage(
        new Message({ type: 'success', message: 'Fin de la descarga' })
      )
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
      return saveAs(
        compressedFile,
        `${
          this.user.license ? this.user.license : this.user.displayName
        }-${this.$t(`document.types.${this.document.name}`)}.zip`
      )
    }, // save

    /**
     * Displays snackbar with {@link Message}
     * @param {Message} message
     */
    showMessage(message) {
      this.message = message
      this.$emit('message', message)
      // TODO set a timeout to auto dismiss
    },
  }, // methods
}
</script>

<style></style>
