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
      setInterval(async () => {
        const chat = await axios.get(`${process.env.VUE_APP_SERVER_HOST}/chat`);
        commit('setChat', chat);
      }, 500);
    },
  },
  modules: { },
});
