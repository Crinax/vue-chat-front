export default {
  state() {
    return {
      server: null,
      isAuthorized: false,
    };
  },

  mutations: {
    setServer(state, server) {
      state.server = server;
    },

    setAuthStatus(state, status) {
      state.isAuthorized = status;
    },
  },

  actions: {
    async init({ state, commit, dispatch }, server) {
      if (!(state.server instanceof WebSocket)) {
        commit('setServer', server);
        await dispatch('auth');
      }
    },

    async auth({ state }) {
      const authData = {
        action: 'auth',
        body: {
          login: process.env.VUE_APP_WS_USER,
          token: process.env.VUE_APP_WS_API_TOKEN,
        },
      };

      let { data } = await state.server.send(JSON.stringify(authData));
      data = JSON.parse(data);

      commit('setAuthStatus', data.access);
    },
  },
}