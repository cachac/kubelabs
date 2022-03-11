import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import VueCompositionAPI from "@vue/composition-api";
import VueFormulate from "@braid/vue-formulate";
import BeeGridTable from "beegridtable";
import { Session } from "./plugins/session";
import session from "./plugins/session";
import "beegridtable/dist/styles/beegridtable.css";
import connectionCheck from "./plugins/connectionCheck";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueZoomer from "vue-zoomer";

Vue.use(VueZoomer);

Vue.use(connectionCheck);
Vue.use(Toast);
Vue.use(BeeGridTable, {
  capture: true,
  transfer: true,
  zIndex: 2000, //set z-index of beegridtable
});
Vue.use(VueCompositionAPI);
Vue.use(VueFormulate);
Vue.use(session);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
