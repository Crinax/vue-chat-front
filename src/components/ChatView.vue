<template>
  <div class="chat">
    <div class="chat__body">
      <template v-if="getChat !== []">
        <div
          v-for="(messageData, index) in getChat"
          :key="index"
          :class="[
              'message',
              messageData.user && messageData.user.login === value ? 'message_to' : 'message_from'
          ]"
        >
          <div v-if="messageData.user">
            <p v-if="messageData.user === value" class="message__login">
              {{ messageData.user.login }}
            </p>
            <p class="message__text">
              {{ messageData.message }}
            </p>
          </div>
        </div>
      </template>
    </div>
    <form class="chat__new-message" @submit.prevent="sendMessage">
      <textarea
        v-model.trim="messageText"
        class="new-message__send"
        @keyup.ctrl.enter.exact.prevent="newLine"
        @keyup.enter.exact.prevent="sendMessage"
      />
      <button class="new-message__send" @submit.prevent="sendMessage">Отправить</button>
    </form>
  </div>
</template>

<script>
import store from '@/store';
import axios from 'axios';

store.dispatch('setChat');

export default {
  name: 'ChatView',
  store,
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      messageText: '',
    };
  },
  computed: {
    getChat() {
      return store.state.chat.data;
    },
  },
  methods: {
    newLine(event) {
      const caret = event.target.selectionStart;

      event.target.setRangeText('\n', caret, caret, 'end');

      this.text = event.target.value;
    },
    async sendMessage() {
      if (this.messageText.length > 0) {
        await axios({
          url: `${process.env.VUE_APP_SERVER_HOST}/message`,
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
          },
          data: {
            login: this.value,
            message: this.messageText,
          },
        });
      }
      this.messageText = '';
    },
  },
};
</script>

<style scoped lang="scss">
p {
  color: #FFFFFF;
  white-space: pre-line;
}
</style>
