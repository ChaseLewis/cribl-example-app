import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/plugins/primevue';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
})
.$mount('#app')
