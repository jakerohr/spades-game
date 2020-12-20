import Vue from 'vue';
import dotenv from 'dotenv';
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';
import App from './App.vue';
import router from './router';
import store from './store';

console.log(process.env.NODE_ENV);
console.log(process.env.VUE_APP_SOCKET_SERVER);
const socket = io(process.env.VUE_APP_SOCKET_SERVER);

Vue.config.productionTip = false;
Vue.use(VueSocketIOExt, socket);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
