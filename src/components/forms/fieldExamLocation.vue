<script>
import { abstractField } from 'vue-form-generator'
export default {
  name: 'FieldExamLocation',
  mixins: [abstractField],
  data: () => ({
    foo: '',
    // // TODO this is temporal must create a more complex catalog 202211.28-16.32
    items: [
      // 'Aguascalientes',
      // 'Baja California',
      // 'Baja California Sur',
      // 'Campeche',
      // 'Chiapas',
      // 'Chihuahua',
      'Ciudad de México',
      // 'Coahuila de Zaragoza',
      // 'Colima',
      // 'Durango',
      // 'Estado de México',
      // 'Guanajuato',
      // 'Guerrero',
      // 'Hidalgo',
      'Jalisco',
      // 'Michoacán de Ocampo',
      // 'Morelos',
      // 'Nayarit',
      'Nuevo León',
      // 'Oaxaca',
      // 'Puebla',
      // 'Querétaro',
      // 'Quintana Roo',
      // 'San Luis Potosí',
      // 'Sinaloa',
      // 'Sonora',
      // 'Tabasco',
      // 'Tamaulipas',
      // 'Tlaxcala',
      // 'Veracruz de Ignacio de la Llave',
      'Yucatán',
      // 'Zacatecas',
    ],
  }), // data
  computed: {}, // computed
  methods: {
    onChange() {
      this.$emit('input', this.foo)
    }, // onchange
  }, // methods
}
</script>

<template>
  <v-container>
    <div
      :id="getFieldID(schema)"
      :name="schema.inputName"
      :class="schema.fieldClasses"
    >
      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="12">
          <v-select
            v-model="foo"
            :items="items"
            :label="$t(`document.types.${schema.label}`)"
            outlined
            @change="onChange"
          ></v-select>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
