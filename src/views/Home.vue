<template>
  <div class="page-wrapper">
    <img alt="logo-bento" class="logo" src="@/assets/img/logo.png" />
    <h1 class="home-page-title">{{ appTitle }}</h1>
    <h2 class="home-page-title">{{ clientName }}</h2>

    <!-- <a rel="noopener" class="documentation-link" target="_blank" href="https://bento-starter.netlify.com/"
      >Documentation →</a
    > -->
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  head() {
    return {
      title: {
        inner: 'Home',
      },
      meta: [
        {
          name: 'description',
          content: `${this.appTitle} home page`,
          id: 'desc',
        },
      ],
    }
  },
  computed: mapState('app', ['appTitle', 'clientName']),
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.page-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .logo {
    margin-bottom: 3rem;
  }

  .home-page-title {
    text-align: center;
    color: $main;
  }

  .documentation-link {
    display: inline-block;
    font-size: 1.2rem;
    color: #fff;
    background-color: #5d6788;
    padding: 0.8rem 1.6rem;
    border-radius: 4px;
    transition: background-color 0.1s ease;
    box-sizing: border-box;
    text-decoration: none;
    width: fit-content;
    font-weight: 500;
  }
}
</style>
