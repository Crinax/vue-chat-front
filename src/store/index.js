import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    chat: [],
  },
  mutations: {
    setChat(state, chat) {
      state.chat = chat;
    },
  },
  actions: {
    async setChat({ commit }) {
      setInterval(() => {
        axios.get(`${process.env.VUE_APP_SERVER_HOST}/chat`)
          .then((data) => commit('setChat', data))
          .catch((err) => console.log(err));
      }, 500);
    },
  },
  modules: { },
});
