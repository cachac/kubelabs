import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import VueCompositionAPI from "@vue/composition-api";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueFormulate from "@braid/vue-formulate";

Vue.use(Toast);

Vue.use(VueCompositionAPI);

Vue.use(VueFormulate);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
