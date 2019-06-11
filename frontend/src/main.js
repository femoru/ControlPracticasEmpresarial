import Vue from 'vue'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueSwal from 'vue-swal'
import CKEditor from '@ckeditor/ckeditor5-vue';
import JsonExcel from 'vue-json-excel'

Vue.component('downloadExcel', JsonExcel)
Vue.use( CKEditor );
Vue.use(VueSwal)

var instance = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  }
})
if (sessionStorage.getItem("token")) {
  instance.defaults.headers.common['Authorization'] = sessionStorage.getItem("token")
}

instance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (!error.response) {
    alert(error.message)
  } else if (401 === error.response.status) {
    store.dispatch('tokenExpire').then(()=>{
      router.go('/')
    });
  }else if(500 == error.response.status){
    return Promise.reject(error.response);
  }
})

Vue.prototype.$axios = instance

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
