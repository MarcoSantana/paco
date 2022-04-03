<template>
  <v-app-bar :color="networkOnLine ? 'primary' : 'error'" app dark>
    <v-app-bar-nav-icon @click="$emit('toggleDrawer')"></v-app-bar-nav-icon>
    <img alt="logo-cmmu" class="logo" src="@/assets/img/logo_cmmu.png" />
    <v-toolbar-title class="site-name d-none d-md-flex">{{ appTitle }}</v-toolbar-title>
    <v-toolbar-title class="site-name d-md-none">{{ appShortTitle }}</v-toolbar-title>
    <v-spacer />
    <v-toolbar-title v-if="!networkOnLine"><small>Fuera de línea</small></v-toolbar-title>
    <v-spacer />
    <v-toolbar-title v-if="isUserLoggedIn && networkOnLine && isUserAdmin" data-test="navbar-products">
      <small class="d-none d-md-flex">Administrador</small>
      <v-icon color="warning" class="d-md-none">mdi-badge-account</v-icon>
    </v-toolbar-title>
    <v-menu v-if="isUserLoggedIn && networkOnLine" bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon color="secondary" v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item>
          <v-list-item-icon><v-icon>mdi-information</v-icon></v-list-item-icon>
          <v-list-item-title>
            <a href="http://cmmu.org.mx/web/aviso-de-privacidad/" target="_blank">
              Aviso de privacidad
            </a>
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-icon><v-icon>mdi-exit-run</v-icon></v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              Salir
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import firebase from 'firebase/app'
import { mapGetters, mapState } from 'vuex'

export default {
  data: () => ({}),
  computed: {
    ...mapGetters('authentication', ['isUserLoggedIn', 'isUserAdmin']),
    ...mapState('authentication', ['user']),
    ...mapState('app', ['networkOnLine', 'appTitle', 'appShortTitle']),
  },
  methods: {
    async logout() {
      await firebase.auth().signOut()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.logo {
  height: 24px;
  padding-right: 8px;
}

.site-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: $light-accent;
  // text-shadow: 1px 1px $secondary;
  position: relative;
}
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  /* z-index: 20; */
  right: 0;
  height: $navbar-height;
  background-color: $navbar-color;
  box-sizing: border-box;
  border-bottom: 1px solid #eaecef;
  padding: 0.7rem 1.5rem;
  line-height: 2.2rem;

  a {
    display: flex;
    align-items: center;
  }

  .title-desktop {
    display: inline;
  }

  .title-mobile {
    display: none;
  }

  @media (max-width: 500px) {
    padding: 0.7rem 0.7rem;

    .can-hide {
      display: none;
    }

    .title-desktop {
      display: none;
    }

    .title-mobile {
      display: block;
    }
  }

  .links {
    padding-left: 1.5rem;
    box-sizing: border-box;
    white-space: nowrap;
    font-size: 0.9rem;
    /* position: absolute; */
    right: 1.5rem;
    top: 0.7rem;
    display: flex;

    .nav-links {
      display: flex;
      align-items: center;
      justify-content: center;

      .nav-item {
        position: relative;
        display: inline-block;
        margin-left: 1.5rem;
        line-height: 2.2rem;

        &:first-child {
          margin-left: 0;
        }

        a {
          font-weight: 500;
          font-size: 0.9rem;
          text-decoration: none;
          color: $navbar-link-color;
          border-color: $light-accent;
          line-height: 1.4rem;
          display: inline-block;
          cursor: pointer;
        }

        @mixin activatedLink() {
          margin-bottom: -2px;
          border-bottom: 2px solid $secondary;
        }

        .router-link-active {
          @include activatedLink;
        }

        @media (hover) {
          :hover {
            @include activatedLink;
          }
        }
      }
    }
  }

  &.offline {
    background: $navbar-offline-color;
    .links .nav-links .nav-item a,
    .site-name {
      color: white;
    }
  }

  .user-picture {
    max-height: 32px;
    margin-left: 1.5rem;
    border-radius: 50%;
  }

  .offline-label {
    padding: 0px 10px;
    border: 1px solid white;
    border-radius: 5px;
    color: white;
    margin-left: 1.5rem;
  }
}
</style>
