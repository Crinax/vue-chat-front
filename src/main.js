import Vue from 'vue';
import App from './App.vue';
import store from './store';

store.dispatch('init');

Vue.directive('focus', {
  inserted(el) {
    el.focus();
  },
});

new Vue({
  render: (h) => h(App),
}).$mount('#app');
