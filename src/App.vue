<template>
  <v-app>
    <v-main>
      <loading v-if="loading"></loading>
      <nav-bar @toggleDrawer="toggleDrawer"></nav-bar>
      <div class="main-wrapper">
        <router-view />
      </div>
      <!-- Change me to vuetify toaster -->
      <new-content-available-toastr
        v-if="newContentAvailable"
        class="new-content-available-toastr"
        :refreshing-app="refreshingApp"
        @refresh="serviceWorkerSkipWaiting"
      ></new-content-available-toastr>
      <apple-add-to-home-screen-modal
        v-if="showAddToHomeScreenModalForApple"
        class="apple-add-to-home-screen-modal"
        @close="closeAddToHomeScreenModalForApple(false)"
      ></apple-add-to-home-screen-modal>
    </v-main>
    <v-navigation-drawer
      v-if="user"
      v-model="drawer"
      app
      class="indigo lighten-4"
    >
      <v-sheet :color="isUserAdmin ? 'orange lighten-4' : ''" class="pa-4">
        <v-avatar class="mb-4" color="grey darken-1" size="64">
          <v-img v-if="user.photoURL" :src="user.photoURL"></v-img>
          <v-img
            v-else
            :src="
              `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user.displayName}`
            "
          ></v-img>
        </v-avatar>

        <div>
          {{ user.displayName }}
          <small>{{ user.email }}</small>
        </div>
      </v-sheet>

      <v-divider></v-divider>
      <v-list v-if="!isUserAdmin" nav dense>
        <v-list-item
          v-for="[icon, text, to] in links"
          :key="icon"
          link
          :to="to"
        >
          <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-if="isUserAdmin">
        <v-list-item
          v-for="[icon, text, to] in adminLinks"
          :key="icon"
          link
          :to="to"
        >
          <v-list-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-icon>
          <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>
<script>
import NavBar from '@/components/NavBar'
import NewContentAvailableToastr from '@/components/NewContentAvailableToastr'
import AppleAddToHomeScreenModal from '@/components/AppleAddToHomeScreenModal'
import Loading from '@/views/Loading'
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Loading,
    NavBar,
    NewContentAvailableToastr,
    AppleAddToHomeScreenModal,
  },
  data() {
    return {
      drawer: true,
      links: [
        // ['mdi-cloud-upload', 'Cargar documentos'],
        ['mdi-home', 'Inicio', { name: 'home' }],
        // ['mdi-inbox-arrow-down', 'Mensajes', 'messages'],
        // ['mdi-account-circle', 'Perfil', 'profile'],
        // ['mdi-cog-outline', 'Configuración', 'settings'],
        ['mdi-folder', 'Mis Documentos', { name: 'documents' }],
        ['mdi-account-question', 'Solicitar examen', { name: 'request' }],
        ['mdi-folder-account', 'Perfil académico', { name: 'academicProfile' }],
        ['mdi-account-edit', 'Datos personales', { name: 'userEdit' }],
      ],
      adminLinks: [
        ['mdi-view-dashboard', 'Centro de control', 'admin/dashboard'],
        ['mdi-text-box-search-outline', 'Ver solicitudes', 'admin/home'],
      ],
    }
  },
  computed: {
    ...mapGetters('app', ['newContentAvailable', 'loading']),
    ...mapGetters('authentication', [
      'isUserLoggedIn',
      'isUserAdmin',
      'isUserIncomplete',
    ]),
    ...mapState('app', [
      'showAddToHomeScreenModalForApple',
      'refreshingApp',
      'loading',
    ]),
    ...mapState('authentication', ['user']),
  },
  methods: {
    ...mapActions('app', [
      'closeAddToHomeScreenModalForApple',
      'serviceWorkerSkipWaiting',
    ]),
    toggleDrawer() {
      this.drawer = !this.drawer
    },
  },
}
</script>

<style lang="scss">
body {
  margin: 0;

  a {
    font-weight: 500;
    text-decoration: none;
  }

  #app {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
    color: #2c3e50;

    .new-content-available-toastr {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }

    .apple-add-to-home-screen-modal {
      position: absolute;
      bottom: 0;
      right: 0;
      top: 0;
      left: 0;
      height: fit-content;
      width: fit-content;
      margin: auto;
      z-index: 1000;
    }

    .main-wrapper {
      margin-top: 3.6rem;
      padding: 8px;
      // max-width: 80vw;

      .page-wrapper {
        width: 60%;
        margin: auto;

        @media screen and (max-width: 1000px) {
          width: 100%;
        }
      }
    }
  }
}
</style>
