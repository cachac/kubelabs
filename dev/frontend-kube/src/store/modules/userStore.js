import service from "../../services/user";

export const namespaced = true;
export const state = {
  publicapi: false,
  privateapi: false,
};
export const mutations = {
  PUBLIC(state, response) {
    state.publicapi = response;
  },
  PRIVATE(state, response) {
    state.privateapi = response;
  },
};
export const actions = {
  checkPrivateApi: ({ commit }) =>
    service.checkPrivateApi().then(({ response }) => {
      commit("PRIVATE", response);
    }),
  checkPublicApi: ({ commit }) =>
    service.checkPublicApi().then(({ response }) => {
      commit("PUBLIC", response);
    }),
};
