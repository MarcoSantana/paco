import { callUpdateRequestStatus } from '@/firebase/functions'

export default {
  name: 'RejectDialog',
  props: {
    request: { type: Object, required: true },
  },
  data: () => ({
    dialog: false,
    reason: '',
    toast: { message: '', type: 'info', show: false, timeout: 2000 },
    result: null,
  }),
  methods: {
    reset() {
      this.dialog = false
      this.reason = ''
      this.toast.message = ''
      this.toast.show = false
      this.toast.type = 'info'
    },
    async changeStatus() {
      if (this.reason.length < 1) {
        this.toast.type = 'error'
        this.toast.message = 'Debe incluir una razón de rechazo'
        this.toast.show = true
        return
      }
      const { request } = this
      this.toast.message = ''
      this.toast = {
        type: 'warning',
        message: 'Cambiando el estado de la solicitud',
        show: true,
      }
      // payload
      const payload = {
        message: this.reason,
        requestId: request.requestId,
        userId: request.userId,
        status: 'rejected',
      }
      await callUpdateRequestStatus(payload).then(result => {
        this.toast = result.data
        return result.data
      })
    },
    // TODO emmit changeStatus
  },
  mounted() {
    console.clear()
    console.log('Reject dialog mounted', this.request)
  },
}
