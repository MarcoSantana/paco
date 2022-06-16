<template>
  <v-sheet
    class="d-flex flex-column"
    :color="`${color} lighten-3`"
    max-width="400"
  >
    <v-card-title>
      <v-icon v-show="icon" large left>mdi-{{ icon }}</v-icon>
      <span
        class="text-h6 font-weight-light info-card-title"
        style="white-space:pre-wrap; word-break:keep-all;"
      >
        <slot name="title">This be dfault title</slot>
      </span>
    </v-card-title>
    <v-list class="px-3" :color="`${color} lighten-4`" dense>
      <slot name="description">
        <span v-if="edit">
          <v-form>
            <v-textarea
              v-model="description"
              :label="$t('description')"
              class="mt-3"
              dense
              outlined
              value="Here must come the data from the parent component"
            ></v-textarea>
          </v-form>
        </span>
        <v-list-item v-else>
          Here must come the data from the parent component
        </v-list-item>
      </slot>
    </v-list>
    <v-spacer></v-spacer>
    <v-card-actions v-if="editable">
      <v-switch
        v-model="edit"
        value="true"
        color="error"
        :label="$t('actions.edit')"
      ></v-switch>
      <v-spacer />
      <span v-show="edit">
        <v-btn outlined color="success">{{ $t('actions.save') }}</v-btn>
        <v-btn outlined color="warning">{{ $t('actions.clear') }}</v-btn>
      </span>
    </v-card-actions>
  </v-sheet>
</template>
<script>
import { isNil } from 'lodash'

export default {
  name: 'InfoCard',
  props: {
    icon: {
      type: String,
      required: false,
      default: 'mdi-info',
    },
    color: {
      type: String,
      required: false,
      default: 'white',
    },
    editable: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      error: null,
      edit: false,
    }
  },
  watch: {
    title(val) {
      if (isNil(val)) {
        this.error = 'El titulo es requerido'
      }
    },
  },
}
</script>
