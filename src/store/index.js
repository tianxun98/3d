import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      addPalette:{
          getValue:0,
      },
      isChange:false,
      auth:{}
  },
  mutations: {
  },
  actions: {
      setParams({commit}, params){
          this.state.auth = params;
          Object.assign(axios.defaults.headers.common,{
              Authorization: this.state.auth.token || "",
              userName: this.state.auth.userName || "",
              tenantId: this.state.auth.tenantId || "111",
              orgId: this.state.auth.orgId || "",
          });
      }
  },
  modules: {
  }
})
