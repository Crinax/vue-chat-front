import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    server: null,
    isAuthorized: false,
    isUserAuthorized: false,
    chat: [],
  },
  mutations: {
    mInit(state) {
      state.server = new WebSocket(process.env.VUE_APP_SERVER_HOST);
    },

    setIsAuthorized(state, isAuthorized) {
      state.isAuthorized = isAuthorized;
    },

    setChat(state, chat) {
      state.chat = chat;
    },
  },
  actions: {
    async init({ commit, dispatch }) {
      if (!(state.server instanceof WebSocket)) {
        commit('mInit');
        await dispatch('authorization');
      }
    },

    async authorization({ commit, state }) {
      const authData = {
        action: 'auth',
        body: {
          login: process.env.VUE_APP_WS_USER,
          token: process.env.VUE_APP_WS_API_TOKEN,
        },
      };

      let { data } = await state.server.send(JSON.stringify(authData));
      data = JSON.parse(data);

      commit('setIsAuthorized', data.access);
    },

    async authUser({ commit, state }, data) {
      const authUserData = {
        action: 'user->auth',
        body: {
          login: data.login,
          password: data.password,
        }
      };

      let { data } = await state.server.send(JSON.stringify(authUserData));
      data = JSON.parse(data);
    },

    async setChat({ commit }) {
      setInterval(() => {
        axios.get(`${process.env.VUE_APP_SERVER_HOST}/chat`)
          .then((data) => commit('setChat', data))
          .catch(() => { });
      }, 500);
    },
  },
  modules: { },
});
