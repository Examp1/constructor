import Vue from 'vue'
import App from './App.vue'
import { ReactiveRefs } from 'vue-reactive-refs'

Vue.config.productionTip = false;
Vue.use(ReactiveRefs);

export default new Vue();

new Vue({
  render: h => h(App),
}).$mount('#app')
