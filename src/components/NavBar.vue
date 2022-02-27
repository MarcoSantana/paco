<template>
  <header class="navbar" :class="{ offline: !networkOnLine }">
    <router-link :to="`/${isUserAdmin ? 'admin/home' : 'home'}`">
      <!-- <img alt="logo-bento" class="logo" src="@/assets/img/bento-starter.svg" /> -->
      <img alt="logo-bento" class="logo" src="@/assets/img/logo_cmmu.png" />
      <span class="site-name title-desktop">{{ appTitle }}</span>
      <span class="site-name title-mobile">{{ appShortTitle }}</span>
    </router-link>

    <div v-if="isUserLoggedIn && networkOnLine && isUserAdmin" data-test="navbar-products" class="nav-item pa-5 ma-5">
      Administrador
      <i class="mdi mdi-badge-account icon"></i>
    </div>
    <div class="links">
      <nav class="nav-links">
        <div v-if="isUserLoggedIn && networkOnLine && isUserAdmin" data-test="navbar-products" class="nav-item ">
          <router-link to="/users" data-test="navbar-products-link">Usuarios</router-link>
        </div>
<<<<<<< HEAD
        <div v-if="isUserLoggedIn && networkOnLine" data-test="navbar-item-documents" class="nav-item ">
          <router-link to="/documents" data-test="navbar-documents-link">Mis Documentos</router-link>
=======
        <div v-if="isUserLoggedIn && networkOnLine && !isUserAdmin" data-test="navbar-item-documents" class="nav-item ">
          <router-link to="/documents" data-test="navbar-documents-link">Documentos</router-link>
>>>>>>> feature/fixCertificationReq
        </div>
        <!-- <div v-if="isUserLoggedIn && networkOnLine" data-test="navbar-item-curriculum" class="nav-item ">
             <router-link to="/curriculum" data-test="navbar-curriculum-link">Curriculum</router-link>
             </div> -->
        <!-- Must validate accoirding to date if the user can request certification, and or it has an active request -->
<<<<<<< HEAD
        <div v-if="isUserLoggedIn && networkOnLine" data-test="navbar-item-request" class="nav-item ">
          <router-link to="/request" data-test="navbar-request-link">Solicitud de examen 2022</router-link>
=======
        <div v-if="isUserLoggedIn && networkOnLine && !isUserAdmin" data-test="navbar-item-request" class="nav-item ">
          <router-link to="/request" data-test="navbar-request-link">Solicitud de examen</router-link>
>>>>>>> feature/fixCertificationReq
        </div>
        <div v-if="!isUserLoggedIn && networkOnLine" data-test="navbar-item-login" class="nav-item">
          <router-link to="/login" data-test="navbar-login-link">Ingreso</router-link>
        </div>
        <div v-if="!isUserAdmin" class="nav-item">
          <a href="http://cmmu.org.mx/web/aviso-de-privacidad/" target="_blank">
            Aviso de privacidad
            <i class="mdi mdi-info" />
          </a>
        </div>
        <div v-if="!isUserLoggedIn && networkOnLine" data-test="navbar-item-signUp" class="nav-item">
          <router-link to="/signUp" data-test="navbar-signUp-link">Crear cuenta</router-link>
        </div>
        <div
          v-if="isUserLoggedIn && networkOnLine"
          data-test="navbar-item-signUp"
          class="nav-item logout-item"
          @click="logout"
        >
          <a>Salir</a>
        </div>
        <div v-if="!networkOnLine" data-test="navbar-item-offlineLabel" class="nav-item offline-label">
          Sin conexión
        </div>
        <div v-if="isUserLoggedIn && networkOnLine && user.photoURL" class="nav-item">
          <img data-test="navbar-item-avatar" class="user-picture can-hide" :src="user.photoURL" alt="Avatar" />
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import firebase from 'firebase/app'
import { mapGetters, mapState } from 'vuex'

export default {
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

.navbar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
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

  .site-name {
    font-size: 1.3rem;
    font-weight: 600;
    color: $light-accent;
    // text-shadow: 1px 1px $secondary;
    position: relative;
  }

  .logo {
    height: 24px;
    padding-right: 8px;
  }

  .links {
    padding-left: 1.5rem;
    box-sizing: border-box;
    white-space: nowrap;
    font-size: 0.9rem;
    position: absolute;
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
