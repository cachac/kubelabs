import globalStore from "./globalStore";
import service from "../../services/user";
import { Session } from "../../plugins/session";

const user = new globalStore({
  user: {},
  userSession: {
    _id: null,
  },
  // módulo del servicio a importar para conexión con api GQL
  serviceModule: "user",
});

export const namespaced = true;
export const state = { ...user.state };
export const mutations = { ...user.mutations };
export const actions = {
  ...user.actions,
  ...{
    create: ({ commit }, item) =>
      service.create(item).then(({ token, _id, username }) => {
        commit("SET", { _id, username });
        Session.set(token);
      }),
    authentication: ({ commit }, credentials) =>
      service.authentication(credentials).then(({ token, _id, username }) => {
        commit("SET", { _id, username });
        Session.set(token);
      }),
    checkPassword: ({ state }, oldPassword) =>
      service.checkPassword({ _id: state.user._id, oldPassword }),
    changePassword: ({ state }, item) =>
      service.changePassword({ _id: state.user._id, ...item }),
  },
};
export const getters = {
  ...user.getters,
  ...{
    getUserRole: (state) => state.userSession.role,
    getUserSession_Id: (state) => state.userSession._id,
  },
};
