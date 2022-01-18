export default {
  state() {
    return {
      server: null,
      isAuthorized: false,
      message: '',
    };
  },

  mutations: {
    setServer(state, server) {
      state.server = server;
    },

    setAuthStatus(state, authStatus) {
      state.isAuthorized = authStatus;
    },

    setMessage(state, message) {
      state.message = message;
    },
  },

  actions: {
    init({ commit }, server) {
      commit('setServer', server);
    },

    async auth({ commit, state }, data) {
      const authUserData = {
        action: 'user->auth',
        body: {
          login: data.login,
          password: data.password,
        }
      };

      let { data } = await state.server.send(JSON.stringify(authUserData));
      data = JSON.parse(data);

      commit('setAuthStatus', data.authorized);
      commit('setMessage', data.message);
    }
  }
}