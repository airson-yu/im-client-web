import Vue from 'vue'
import App from './App.vue'
import iView from 'view-design';
import store from './store'
import 'view-design/dist/styles/iview.css';
import './my-theme/index.less';
//import Result from "../tools/result";
import 'view-design/dist/styles/fonts/ionicons.ttf';
import 'view-design/dist/styles/fonts/ionicons.woff';
import 'view-design/dist/styles/fonts/ionicons.svg';
//import logger from "../tools/logger";

Vue.use(iView);
Vue.config.productionTip = false;

new Vue({
    store,
    render: h => h(App),
}).$mount('#app')
