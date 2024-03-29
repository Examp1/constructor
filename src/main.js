import Vue from 'vue'
import App from './App.vue'
import { ReactiveRefs } from 'vue-reactive-refs'
import Vuex from 'vuex'
import { VueHammer } from 'vue2-hammer';

Vue.config.productionTip = false;
Vue.use(ReactiveRefs);
Vue.use(Vuex)
VueHammer.config.press = {
  time: 250
};
Vue.use(VueHammer);

export default new Vue();


const store = new Vuex.Store({
  state: {
    origWidth: 0,
    origHeight: 0,
    canvasZoom: 1,
    maxWSize: 100,
    minWSize: 100,
    maxHSize: 100,
    minHSize: 100,

    isRender: false,

    states: [{
      imgItems: [],
      orient: 'h',
      bgSrc: '#a1d7de',
    }],
    currentStateIndex: 0,
    maxLength: 14,

    photoOriginal: null,
    cropedBase64: null,

    templates: [],

    isSelectedItem: false,
    modalPhotoCropper: false,
    canCrop: false,
    orientAlert: false,
    firstStepModal: false,

    
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
    SET_MAXSIZE(state, payload){
      state.maxWSize = payload.w;
      state.minWSize = payload.w * 0.1;
      state.maxHSize = payload.h;
      state.minHSize = payload.h * 0.1;
    },

    SER_ORIG_PHOTO(state, payload){
      state.photoOriginal = payload.photo;
      state.modalPhotoCropper = true;
    },
    SET_CROPED_PHOTO(state, payload){
      state.cropedBase64 = payload.photo;
      state.modalPhotoCropper = false;
      state.photoOriginal = null;
    },

    SET_IS_SELECTED(state, payload){
      state.isSelectedItem = payload.val;
    },
    SET_TEMPLATES(state, payload){
      state.templates = payload.templates;
    },
    SET_CAN_CROP(state, payload){
      state.canCrop = payload.val;
    },
    SET_ISRENDER(state, payload){
      state.isRender = payload.val;
    },

    SET_FIRSTSTEPMODAL(state, payload){
      state.firstStepModal = payload.val;
    },
    SET_ORIENTALERT(state, payload){
      state.orientAlert = payload.val;
    },
    // SET_FIRSTSTEPMODAL(state, payload){
    //   state.firstStepModal = payload.val;
    // },
  },
  actions: {
    CANSEL_CROP ({ commit, state}) {
      state.photoOriginal = null;
      state.modalPhotoCropper = false;
    }
  }
})

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
