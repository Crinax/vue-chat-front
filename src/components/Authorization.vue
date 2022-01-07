<template>
  <div class="authorization-form">
    <transition name="fade" mode="out-in" appear>
      <form
          @submit.prevent="toPassword"
          class="authorization-form__login-form login-form default-form"
          key="login-form"
          v-if="!isValidLogin"
          autofocus
      >
        <transition name="fade-reverse" mode="out-in" appear>
          <p class="login-form__error-message form-error-message" v-if="isError">
            {{ errorMessage }}
          </p>
        </transition>
        <div class="animated-field">
          <input
              @input="checkLogin"
              v-model.trim="login"
              id="login"
              class="login-form__login-field form-field"
              :class="['login-form__login-field', 'form-field', hasLoginContent]"
              autofocus
          />
          <label class="field-placeholder" for="login">Логин</label>
        </div>
        <button @submit.prevent="" class="login-form__send-button form-button">
          Далее
        </button>
      </form>
      <form
          @submit.prevent="sendForm"
          class="authorization-form__password-form password-form default-form"
          key="password-form"
          @keydown.enter.shift.exact.prevent="toLogin"
          autofocus
          v-else
      >
        <transition name="fade-reverse" mode="out-in" appear>
          <p class="login-form__error-message form-error-message" v-if="isError">
            {{ errorMessage }}
          </p>
        </transition>
        <div class="animated-field">
          <input
              type="password"
              v-model.trim="password"
              @input="checkPassword"
              id="password"
              :class="['password-form__password-field', 'form-field', hasPasswordContent]"
              autofocus
          />
          <label class="field-placeholder" for="password">Пароль</label>
        </div>
        <button @submit.prevent="" class="password-form__send-button form-button">
          Войти
        </button>
      </form>
    </transition>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Authorization',
  data() {
    return {
      login: '',
      password: '',
      isError: false,
      isValidLogin: false,
      errorMessage: '',
    };
  },
  methods: {
    checkLogin() {
      const regex = /^[A-Za-z0-9_]{3,}$/;

      if (!regex.test(this.login) || parseInt(this.login[0], 10)) {
        this.isError = true;
        this.errorMessage = 'Логин должен состоять из латинских символов и цифр от 0 до 9. Логин не должен начинаться с цифры и быть короче 3 символов';
      } else {
        this.isError = false;
        this.errorMessage = '';
      }
    },
    checkPassword() {
      if (this.password.length < 6) {
        this.isError = true;
        this.errorMessage = 'Пароль должен состоять минимум из 6 символов';
      } else {
        this.isError = false;
        this.errorMessage = '';
      }
    },
    toPassword() {
      this.checkLogin();
      this.isValidLogin = !this.isError;
    },
    toLogin() {
      this.isValidLogin = false;
      this.password = '';
    },
    async sendForm() {
      this.checkPassword();

      if (this.isError) {
        return;
      }

      let result;

      setTimeout(() => {
        this.errorMessage = '';
        this.isError = false;
      }, 2500);

      try {
        result = await axios({
          url: `${process.env.VUE_APP_SERVER_HOST}/auth`,
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
          },
          data: {
            login: this.login,
            password: this.password,
          },
        });
      } catch (err) {
        this.isValidLogin = false;
        this.isError = true;
        this.errorMessage = 'Что-то пошло не так. Попробуйте позже';

        console.log(err);

        return;
      }

      if (result.data.authorized) {
        this.$emit('complete', [result.data.authorized, this.login]);

        return;
      }

      this.isValidLogin = false;
      this.isError = true;

      if (result.data.message) {
        this.errorMessage = result.data.message;
        return;
      }

      this.errorMessage = 'Что-то пошло не так. Попробуйте позже';
    },
  },
  computed: {
    hasLoginContent() {
      if (this.login.length > 0) {
        return 'has-content';
      }

      return '';
    },
    hasPasswordContent() {
      if (this.password.length > 0) {
        return 'has-content';
      }

      return '';
    },
  },
};
</script>

<style scoped lang="scss">
.fade-enter-active, .fade-leave-active, .fade-reverse-enter-active, .fade-reverse-leave-active {
  transition: opacity .7s,
              transform .7s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(200px);
}

.fade-reverse-enter, .fade-reverse-leave-to {
  opacity: 0;
  transform: translateY(-4vh);
}

.authorization-form {
  width: 384px;
  height: 191px;
  .default-form {
    width: 384px;
    height: 191px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 500px 0 rgba(0, 176, 161, 0.56);
    background: #000356;
    border-radius: 30px;
    font-size: 16.235px;
    .form-error-message {
      margin: 0;
      position: absolute;
      width: 80vw;
      top: 2vh;
      background: rgba(255, 105, 115, 0.5);
      border-left: 3px solid rgba(255, 105, 115, 0.7);
      padding: 19.2px 9.55px;
      color: #FFFFFF;
      font-size: 1.7vh;
      font-weight: bold;
    }
    .form-field {
      outline: none;
      width: 243px;
      position: relative;
      z-index: 1;
      box-sizing: border-box;
      border: 3px solid #00B09B;
      border-bottom: none;
      padding: 16px 19px 5px 19px;
      margin: 0;
      text-align: center;
      border-top-left-radius: 30px;
      border-top-right-radius: 30px;
      background: transparent;
      color: #FFFFFF;
      font-weight: bold;
      font-size: 16.235px;
      &:focus ~ .field-placeholder {
        top: -8px;
        z-index: 2;
      }
    }
    .form-button {
      outline: none;
      width: 243px;
      box-sizing: border-box;
      border: 3px solid #00B09B;
      border-top: none;
      cursor: pointer;
      padding: 10px 19px;
      margin: 0;
      border-bottom-left-radius: 30px;
      border-bottom-right-radius: 30px;
      background-color: #00B09B;
      color: #FFFFFF;
      font-weight: bold;
      font-size: 16.235px;
    }
  }
  .animated-field {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    .field-placeholder {
      position: absolute;
      font-weight: bold;
      font-size: 16.235px;
      top: 16px;
      z-index: 0;
      padding: 0 9.6px;
      background: #000356;
      color: #FFFFFF;
      border-radius: 100%;
      transition: top .7s,
                  z-index .7s;
    }
    .has-content ~ .field-placeholder {
      top: -8px;
      z-index: 2;
    }
  }
}
</style>
