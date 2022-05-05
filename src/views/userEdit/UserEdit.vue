<template>
  <v-container>
    <validation-observer v-slot="{ invalid, changed }">
      <form @submit.prevent="submit">
        <v-card class="mx-auto" max-width="200">
          <v-img :src="localUser.photoURL" max-width="200px" max-height="300px" />
          <v-card-text class="pt-6" style="position: relative;">
            <v-btn absolute color="info" class="white--text" fab medium right top>
              <v-icon>mdi-camera</v-icon>
            </v-btn>
          </v-card-text>
          <v-card-title class="text-capitalize">
            {{ localUser.name | capitalize }}
            <br />
            {{ localUser.lastname1 | capitalize }}
            <br />
            {{ localUser.lastname2 | capitalize }}
          </v-card-title>
        </v-card>
        <v-card class="px-5">
          <validation-provider v-slot="{ errors }" rules="numeric|length:7,10|required">
            <span id="registration-license-span" :class="{ error: errors[0] }">
              <v-text-field
                id="userEdit-license"
                v-model="localUser.license"
                autocomplete="off"
                class="my-1"
                counter="10"
                data-test="license"
                hint="Nivel licenciatura tipo C1 (de 7 a 10 dígitos)"
                label="Cédula profesional"
                name="license"
                placeholder="Cédula profesional de licenciatura en medicina"
                prepend-inner-icon="mdi-badge-account"
                type="text"
                disabled
              />
              <span class="error--text error lighten-4">{{ errors[0] }}</span>
            </span>
          </validation-provider>
          <validation-provider v-slot="{ errors }" rules="required|length:3,30">
            <v-text-field
              id="userEdit-name"
              v-model="localUser.name"
              autocomplete="off"
              class="my-1"
              label="Nombre"
              hint="ej. Juan Carlos"
              type="text"
              prepend-icon="mdi-face"
              name="name"
              counter="30"
              placeholder="Nombres (ej. Juan Carlos)"
              data-test="userEdit-name"
              hide-details="auto"
            />
            <span class="error--text error lighten-4">{{ errors[0] }}</span>
          </validation-provider>
          <v-text-field
            id="userEdit-lastname-1"
            v-model="localUser.lastname1"
            autocomplete="off"
            class="my-1"
            counter="30"
            data-test="userEdit-lastname-1"
            hint="Primer apellido"
            label="Apellido paterno"
            name="lastname-1"
            placeholder="Apellido Paterno (ej. González)"
            prepend-icon="mdi-form-textbox"
            type="text"
          />
          <v-text-field
            id="userEdit-lastname-2"
            v-model="localUser.lastname2"
            autocomplete="off"
            class="my-1"
            counter="30"
            data-test="userEdit-lastname-2"
            hint="Primer apellido"
            label="Apellido materno"
            name="lastname-1"
            placeholder="Apellido materno (ej. González)"
            prepend-icon="mdi-form-textbox"
            type="text"
          />
          <v-text-field
            id="userEdit-email"
            v-model="localUser.email"
            autocomplete="off"
            data-test="userEdit-email"
            hint="Debe ser una dirección válida"
            label="Correo electrónico"
            name="email"
            placeholder="E-mail (ej. correoejemplo@dominio.com)"
            prepend-icon="mdi-email"
            type="email"
          />

          <v-text-field
            id="registration-phoneNumber"
            ref="phoneNumber"
            v-model="localUser.phoneNumber"
            autcomplete="off"
            clearable
            data-test="registration-phoneNumber"
            hint="Debe ser un teléfono celular válido en México"
            label="Teléfono celular"
            name="phoneNumber"
            prepend-icon="mdi-cellphone-basic"
          ></v-text-field>
          <v-card-actions>
            <v-btn block color="success" outlined :disabled="invalid || !changed">Guardar cambios</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </validation-observer>
    <v-card>Model {{ localUser }}</v-card>
  </v-container>
</template>
<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import capitalize from '@/filters/capitalize'

export default {
  filters: { capitalize },
  data() {
    return {
      localUser: this.getUser(),
      errors: null,
      valid: true,
    }
  },
  computed: {
    ...mapState('authentication', ['user']),
  },

  mounted() {
    // console.log('refs.phoneNumber', this.$refs.phoneNumber.disabled)
    // this.localUser = this.getUser()
    //  console.log('localUser', this.localUser)
    //  this.localUser = Object.assign(this.localUser, this.getUser())
    //  console.log('localUser', this.localUser)
  },
  methods: {
    ...mapMutations('authentication', ['setUser']),
    ...mapGetters('authentication', ['getUser']),
  },
}
</script>
