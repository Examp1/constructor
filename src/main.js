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
    canvasZoom: 1,

    states: [{
      imgItems: [],
      orient: 'h',
      bgSrc: '',
    }],
    currentStateIndex: 0,
    maxLength: 14,

    photoOriginal: null,

    modalPhotoCropper: false,
  },
  mutations: {
    SET_ORIG_SIZE (state, paylpad) {
      state.origWidth = paylpad.width;
      state.origHeight = paylpad.height;
    },
    SET_CURRENT_ZOOM (state, paylpad) {
      state.canvasZoom = paylpad.zoom;
    },

    PUSH_STATE(state, payload){
      if(state.currentStateIndex < state.maxLength){
        state.states.push(payload.state);
        state.currentStateIndex++;
      }
      else{
        state.currentStateIndex = state.maxLength;
        state.states = [...state.states.slice(1), payload.state];
      }
    },
    REVERT_STATE(state){
      // debugger
      if(state.currentStateIndex > 0){
        state.currentStateIndex--;
        state.states = state.states.slice(0, state.states.length-1);
      }
    },

    SER_ORIG_PHOTO(state, payload){
      state.photoOriginal = payload.photo;
      state.modalPhotoCropper = true;
    },
  }
})

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
