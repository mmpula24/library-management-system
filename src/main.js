import * as mdbvue from "mdbvue";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbvue/lib/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Vue from 'vue';
import App from './App';
import router from './router';
import Notifications from 'vue-notification';

Vue.use(Notifications);

for (const component in mdbvue) {
  Vue.component(component, mdbvue[component]);
}

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
