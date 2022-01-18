export default {
  state() {
    return {
      server: null,
      timeout: 500,
      timerID: null,
    };
  },

  mutations: {
    setServer(state, server) {
      state.server = server;
    },

    setChat(state, chat) {
      state.chat = chat;
    },
    
    increaseTimeout(state) {
      state.timeout += 150;
    },

    setTimerID(state, id) {
      state.timerID = id;
    }
  },

  actions: {
    async init({ commit, dispatch }, server) {
      commit('setServer', server);
      await dispatch('setChat');
    },

    async setChat({ commit, state }) {
      const chatData = {
        action: 'chat',
      };

      const timer = setInterval(async () => {
        let { data } = await state.server.send(JSON.stringify(chatData));
        data = JSON.parse(data);
        
        commit('setChat', data);
      }, state.timeout);
    },

    send({ commit }, data) {
      const { login, message } = data;
      const sendData = {
        action: 'chat->send',
        body: { login, message },
      };

      await state.server.send(JSON.stringify(sendData));
    }
  },
}