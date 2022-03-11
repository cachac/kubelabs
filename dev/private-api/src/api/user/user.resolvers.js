

export default {
  Query: {
    User: () => ({})
  },

  UserQuery: {
    checkPrivateApi: async () => {
      console.log('Check Private API: OK!!! 🤯')

      return true
    },
    checkPublicApi: async () => {
      console.log('Check Public API: OK!!! 🚀')

      return true
    }
  }
}
