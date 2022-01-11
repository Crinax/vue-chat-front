<template>
  <div class="chat">
    <div class="chat__body">
        <template v-if="getChat !== []">
          <div
            v-for="(messageData, index) in getChat"
            :key="messageData.id"
            :class="[
                'fade-animation',
                'message',
                isFrom(messageData),
                isPreviousDiff(messageData, index),
            ]"
          >
            <div v-if="messageData.user">
              <p
                v-if="isLoginPrinted(messageData, index)"
                class="message__login"
              >
                {{ messageData.user.login }}
              </p>
              <p class="message__text">
                {{ messageData.message }}
              </p>
            </div>
          </div>
        </template>
    </div>
    <form
      class="chat__new-message"
      @submit.prevent=""
      @keyup.ctrl.enter.exact.prevent="sendMessage"
    >
      <textarea
        v-model.trim="messageText"
        class="new-message__field"
      />
      <button class="new-message__send" @click="sendMessage">
        <svg
          id="sendIcon"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 32 32"
          style="enable-background:new 0 0 32 32;"
          xml:space="preserve"
        >
          <path
            class="st0"
            d="M26.4,2.9L3.8,15c-0.7,0.4-0.7,1.5,0.1,1.8l20.8,8.7c0.6,0.3,1.3-0.2,1.4-0.8l1.7-20.8
              C27.9,3,27.1,2.5,26.4,2.9 M26,4L13,20v7.3c0,0.9,1.2,1.4,1.8,0.7L19,23"
          />
        </svg>
      </button>
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
    isLoginPrinted({ user }, index) {
      return user.login !== this.value
        && (this.getChat[index - 1] && this.getChat[index - 1].user.login !== user.login);
    },
    isFrom({ user }) {
      if (user && user.login === this.value) {
        return 'message_from';
      }

      return 'message_to';
    },
    isPreviousDiff({ user }, index) {
      const prev = this.getChat[index - 1];
      if (prev) {
        if (prev.user.login !== user.login) {
          return 'previous';
        }

        return '';
      }

      return 'previous';
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
.fade-animation {
  animation: fade .5s;
}

@keyframes fade {
  0% {
    opacity: 0;
    transform: translateY(100px);
  }
  100% {
    opacity: 1;
    transform: none;
  }
}

.chat {
  width: 100vw;
  height: 100vh;
  background: #000356;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &__body {
    width: 90%;
    height: 85%;
    background: #000234;
    border-radius: 50px 50px 0 0;
    padding: 15px 20px;
    overflow-y: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    -ms-overflow-style: none;
    scrollbar-width: none;
    position: absolute;
    top: 2vh;
    @media screen and (max-width: 800px) {
      top: 0;
      border-radius: 0;
      padding: 15px 15px;
      width: calc(100% - 30px);
      position: relative;
    }
    &::-webkit-scrollbar {
      width: 0;
      display: none;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: transparent;
    }
    .message {
      padding: 0 15px;
      border-radius: 10px;
      margin: 5px 0 0 0;
      max-width: 40%;
      position: relative;
      &.previous {
        margin: 25px 0 0 0;
      }
      &_to {
        background-color: #00047a;
        align-self: flex-start;
      }
      &_from {
        background-color: #00277a;
        align-self: flex-end;
      }
      &__login {
        position: absolute;
        color: #FFFFFF;
        font-size: 12px;
        top: -16px;
        margin: 0;
        padding: 0;
        left: 5px;
      }
      &__text {
        color: #FFFFFF;
        white-space: pre-line;
        word-wrap: break-word;
        font-size: 18px;
        @media screen and (max-width: 800px) {
          font-size: 14px;
          margin: 9px 0;
        }
      }
    }
  }
  &__new-message {
    position: absolute;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    bottom: 0;
    width: 90%;
    background-color: #000234;
    justify-content: space-between;
    padding: 15px 20px;
    border-radius: 0 0 50px 50px;
    @media screen and (max-width: 800px) {
      position: relative;
      width: 100%
    }
    .new-message__field {
      width: 100%;
      outline: none;
      background-color: #00357a;
      margin: 0;
      resize: none;
      border: none;
      color: #FFFFFF;
      border-radius: 50px 0 0 60px;
      min-height: 64px;
      box-sizing: border-box;
      padding-left: 25px;
      padding-top: 9px;
      @media screen and (max-width: 800px) {
        width: 100%;
      }
    }
    .new-message__send {
      & svg {
        width: 48px;
        height: 48px;
        margin: 0 5px 0 0;
      }
      width: 64px;
      height: 64px;
      border: none;
      display: flex;
      cursor: pointer;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      padding: 0;
      background-color: #00357a;
      border-radius: 0 50px 50px 0;
    }
  }
}

.st0{
  fill: none;
  stroke: #00B09B;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-miterlimit: 10;
}
</style>
