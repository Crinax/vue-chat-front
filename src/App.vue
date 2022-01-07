<template>
  <div id="app">
    <Authorization @complete="completeAuthorisation" v-if="!isAuthorised" />
    <ChatView v-model="login" v-else />
  </div>
</template>

<script>
import Authorization from '@/components/Authorization.vue';
import ChatView from '@/components/ChatView.vue';

export default {
  name: 'App',
  data() {
    return {
      isAuthorised: false,
      login: '',
    };
  },
  components: {
    Authorization,
    ChatView,
  },
  methods: {
    completeAuthorisation([isComplete, login]) {
      console.log({ isComplete, login });
      this.isAuthorised = isComplete;
      this.login = login;
    },
  },
};
</script>

<style lang="scss">
  * {
    transition: .3s;
    font-family: "Open Sans", sans-serif;
  }

  body {
    margin: 0;
    padding: 0;
    transition: 0s;
  }

  #app {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000234;
  }
</style>
