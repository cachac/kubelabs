import Vuex from "vuex";
import Vue from "vue";

import * as userStore from "./modules/userStore";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    userStore,
  },
});
