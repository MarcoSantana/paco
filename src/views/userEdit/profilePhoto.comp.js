import { storage } from 'firebase'
import { mapGetters } from 'vuex'
import { isNil } from 'lodash'
import PhotoUpload from '@/views/userEdit/PhotoUpload.vue'
import capitalize from '@/filters/capitalize'

export default {
  components: { PhotoUpload },
  fileters: { capitalize },
  mounted() {
    console.log('this.user', this.user)
  },
  props: { model: { type: Object, required: true } },
  data() {
    return {
      dialog: false,
      fileURL: null,
      localLoading: false,
      user: this.getUser(),
    }
  },
  methods: {
    ...mapGetters('authentication', ['getUser']),
    getURL(file) {
      if (isNil(file) || typeof file !== 'object') return null
      return URL.createObjectURL(file)
    },
  },
  asyncComputed: {
    photoFile() {
      const storageRef = storage().ref()
      console.log('storageRef', storageRef)
    },
  },
}
