export default {
  name: 'RejectDialog',
  props: {
    request: { type: String, required: true },
  },
  data: () => ({
    dialog: false,
    reason: '',
    toast: { message: '', color: 'primary', show: false },
  }),
  methods: {
    reset() {
      this.dialog = false
      this.reason = ''
      this.toast.show = true
    },
    // TODO make changeStatus method
    // TODO emmit changeStatus
  },
  mounted() {
    console.log('Reject dialog mounted', this.request)
  },
}
