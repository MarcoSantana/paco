<template>
  <div
    class="v-input
          v-input--is-label-active
          theme--light
          v-text-field
          v-text-field--is-booted"
  >
    <div class="v-input__control">
      <div class="v-input__slot">
        <div class="v-text-field__slot">
          <label
            for="map2"
            class="v-label v-label--active theme--light"
            style="left: 0px; right: auto; position: absolute;"
          >
            Busque una dirección
          </label>
          <vue-google-autocomplete
            :id="id"
            ref="address2"
            classname="form-control"
            placeholder="Busque su dirección"
            :country="country"
            :types="types"
            @placechanged="getAddressData"
          ></vue-google-autocomplete>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueGoogleAutocomplete from 'vue-google-autocomplete'

export default {
  components: {
    VueGoogleAutocomplete,
  },
  props: {
    country: { type: String, required: false },
    id: { type: String, required: true },
    types: { type: Array, default: () => ['geocode'] },
  },
  methods: {
    /**
     * When the location found
     * @param {Object} addressData Data of the found location
     * @param {Object} placeResultData PlaceResult object
     * @param {String} id Input container ID
     */
    getAddressData(e) {
      this.$emit('address-data', e)
    },
  },
}
</script>
