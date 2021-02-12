import Vue from 'vue'
import App from './App.vue'
import { ReactiveRefs } from 'vue-reactive-refs'
import Vuex from 'vuex'

Vue.config.productionTip = false;
Vue.use(ReactiveRefs);
Vue.use(Vuex)

export default new Vue();


const store = new Vuex.Store({
  state: {
    origWidth: 0,
    origHeight: 0,
    canvasZoom: 1
  },
  mutations: {
    SET_ORIG_SIZE (state, paylpad) {
      state.origWidth = paylpad.width;
      state.origHeight = paylpad.height;
    },
    SET_CURRENT_ZOOM (state, paylpad) {
      state.canvasZoom = paylpad.zoom;
    },
  }
})

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
