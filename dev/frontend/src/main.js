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
  created() {
    const userToken = Session.get();
    if (userToken) {
      const { _id, username } = JSON.parse(
        Buffer.from(userToken.split(".")[1], "base64").toString("ascii")
      );
      this.$store.commit("userStore/SET", { _id, username });
    }
  },
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
