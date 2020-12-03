import Vue from 'vue'
import App from './App.vue'
import Tooltip from 'vue-directive-tooltip';
import 'vue-directive-tooltip/dist/vueDirectiveTooltip.css';

Vue.use(Tooltip);

import '@/assets/css/variables.scss';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
