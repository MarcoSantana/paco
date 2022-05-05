<template>
  <v-container>
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-btn fab color="info" dark v-bind="attrs" v-on="on">
          <v-icon>mdi-help-circle</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 primary lighten-2 white--text">
          ¿Por qué veo esta pantalla?
        </v-card-title>

        <v-card-text class="pt-2">
          <p>Para poder almacenar sus datos adecuadamente, necesitamos tenerlos todos y de forma correcta.</p>
          <p>
            Los datos obligatorios están marcados con una estrella
            <v-icon>mdi-star</v-icon>
          </p>

          <p>
            Puede cambiar los datos de este formulario y una vez que esté completo puede dar click en el botón de
            "Guardar cambios"
          </p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">
            Entiendo
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
                append-icon="mdi-star"
                autocomplete="off"
                class="my-1"
                clearable
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
            </span>
            <span class="error--text error lighten-4">{{ errors[0] }}</span>
          </validation-provider>
          <validation-provider v-slot="{ errors }" rules="required|email">
            <span name="userEdit-email-span" :class="{ error: errors[0] }">
              <v-text-field
                id="userEdit-email"
                v-model="localUser.email"
                append-icon="mdi-star"
                autocomplete="off"
                clearable
                data-test="userEdit-email"
                disabled
                hint="Debe ser una dirección válida"
                label="Correo electrónico"
                name="email"
                placeholder="E-mail (ej. correoejemplo@dominio.com)"
                prepend-icon="mdi-email"
                type="email"
              />
            </span>
            <span class="error--text error lighten-4">{{ errors[0] }}</span>
          </validation-provider>
          <validation-provider v-slot="{ errors, required }" rules="required|length:3,30">
            <span name="userEdit-name-span" :class="{ error: errors[0] }">
              <v-text-field
                id="userEdit-name"
                v-model="localUser.name"
                :append-icon="required ? 'mdi-star' : ''"
                autocomplete="off"
                class="my-1 { error: errors[0]}"
                clearable
                counter="30"
                data-test="userEdit-name"
                hide-details="auto"
                hint="ej. Juan Carlos"
                label="Nombre"
                name="name"
                placeholder="Nombres (ej. Juan Carlos)"
                prepend-icon="mdi-face"
                type="text"
              />
            </span>
            <span class="error--text error lighten-4">{{ errors[0] }}</span>
          </validation-provider>

          <validation-provider v-slot="{ errors, required }" rules="required|length:3,30">
            <span name="userEdit-lastname1-span" :class="{ error: errors[0] }">
              <v-text-field
                id="userEdit-lastname-1"
                v-model="localUser.lastname1"
                append-icon="mdi-star"
                autocomplete="off"
                class="my-1"
                clearable
                counter="30"
                data-test="userEdit-lastname-1"
                hint="Primer apellido"
                label="Apellido paterno"
                name="lastname-1"
                placeholder="Apellido Paterno (ej. González)"
                prepend-icon="mdi-form-textbox"
                type="text"
              />
            </span>

            <span class="error--text error lighten-4">{{ errors[0] }}</span>
          </validation-provider>
          <validation-provider v-slot="{ errors }" rules="required|length:3,30">
            <span name="userEdit-lastname2-span" :class="{ error: errors[0] }">
              <v-text-field
                id="userEdit-lastname-2"
                v-model="localUser.lastname2"
                append-icon="mdi-star"
                autocomplete="off"
                class="my-1"
                clearable
                counter="30"
                data-test="userEdit-lastname-2"
                hint="Primer apellido"
                label="Apellido materno"
                name="lastname-1"
                placeholder="Apellido materno (ej. González)"
                prepend-icon="mdi-form-textbox"
                type="text"
              />
            </span>
            <span class="error--text error lighten-4">{{ errors[0] }}</span>
          </validation-provider>

          <validation-provider v-slot="{ errors }" rules="required|cellphone">
            <span name="userEdit-phoneNumber-span" :class="{ error: errors[0] }">
              <v-text-field
                id="registration-phoneNumber"
                ref="phoneNumber"
                v-model="localUser.phoneNumber"
                append-icon="mdi-star"
                autcomplete="off"
                clearable
                data-test="registration-phoneNumber"
                hint="Debe ser un teléfono celular válido en México"
                label="Teléfono celular"
                name="phoneNumber"
                prepend-icon="mdi-cellphone-basic"
              />
            </span>
            <span class="error--text lighten-4">{{ errors[0] }}</span>
          </validation-provider>
          <v-card-actions>
            <v-btn block color="success" outlined :disabled="invalid || !changed">Guardar cambios</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </validation-observer>
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
      dialog: false,
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
