import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementUI from "element-ui";
import http from "./servers/servers";
import "element-ui/lib/theme-chalk/index.css";
Vue.config.productionTip = false;
Vue.prototype.$http = http;
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
