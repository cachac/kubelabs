import service from "../../services/user";

export const namespaced = true;
export const state = {
  publicApi: false,
  privateApi: false,
};
export const mutations = {
  PUBLIC: (state, response) => (state.publicApi = response),
  PRIVATE: (state, response) => (state.privateApi = response),
};
export const actions = {
  checkPrivateApi: ({ commit }) =>
    service
      .checkPrivateApi()
      .then((response) => commit("PRIVATE", response))
      .catch(() => commit("PUBLIC", false)),
  checkPublicApi: ({ commit }) =>
    service
      .checkPublicApi()
      .then((response) => commit("PUBLIC", response))
      .catch(() => commit("PUBLIC", false)),
};
