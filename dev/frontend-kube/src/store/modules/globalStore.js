/* eslint-disable prefer-template */
export default class {
  constructor(defaultState) {
    this.service = {
      serviceModule: null,
      get() {
        return this.serviceModule;
      },
      async set() {
        this.serviceModule = await import(
          "../../services/" + defaultState.serviceModule
        ).then((d) => d.default);
      },
    };

    this.service.set();
    this.state = { ...defaultState, list: [], saved: null };

    this.mutations = {
      RESET_STATE: (state) => Object.assign(state, defaultState),
      SET: (state, obj) => (state[defaultState.serviceModule] = obj),
      SET_LIST: (state, objs) => (state.list = objs),
      UPDATE_LIST: (state, obj) => {
        const newItem = state.list.find((e) => e._id === obj._id);
        if (!newItem) state.list = [obj, ...state.list];
        else Object.keys(newItem).forEach((i) => (newItem[i] = obj[i]));
      },
      DELETE_LIST: (state, _id) =>
        (state.list = state.list.filter((e) => e._id !== _id)),
    };
    this.actions = {
      readAll: ({ commit, state }, { refresh } = { refresh: false }) => {
        if (state.list.length === 0 || refresh) {
          return this.service
            .get()
            .readAll()
            .then((result) => {
              commit("SET_LIST", result);
              return result;
            });
        }

        return state.list;
      },

      readById: ({ commit }, _id) => {
        if (!_id) {
          commit("SET", { ...defaultState[defaultState.serviceModule] });
          return {};
        }

        return this.service
          .get()
          .readById(_id)
          .then((result) => {
            commit(
              "SET",
              result || { ...defaultState[defaultState.serviceModule] }
            );
            return result;
          });
      },

      create: ({ commit }, item) =>
        this.service
          .get()
          .create(item)
          .then((result) => {
            commit("SET", result);
            commit("UPDATE_LIST", result);
          }),

      update: ({ commit }, item) =>
        this.service
          .get()
          .update(item)
          .then((result) => {
            commit("SET", result);
            commit("UPDATE_LIST", result);
          }),

      delete: ({ commit }, _id) =>
        this.service
          .get()
          .delete(_id)
          .then((result) => {
            commit("DELETE_LIST", result ? _id : null);
          }),

      setState: ({ commit }, item) =>
        this.service
          .get()
          .setState(item)
          .then((result) => {
            commit("UPDATE_LIST", result);
          }),
    };

    this.getters = {
      get_Id: (state) => state[defaultState.serviceModule]._id,
    };
  }
}
