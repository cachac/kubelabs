import { ApolloServer } from 'apollo-server-express'
import config from '../config'
import context from '../util/context'
import schema from './schema'

export const apolloServer = new ApolloServer({
  schema,
  playground: config.NODE_ENV !== 'production',
  context: async ({ req }) => ({
    userSession: req ? await context.verifyUser(req) : null
    // loaders: {
    //   tipoProducto: new Dataloader(keys => loaders.batchTypes(keys, 'tipoProducto')),
    // }
  }),

  subscriptions: {
    onConnect: async connectionParams => {
      console.log('connectionParams :>> ', connectionParams);
      if (connectionParams.authToken) {
        const isValid = await context.verifyUser(connectionParams.authToken)

        if (!isValid) throw new Error('Acción no permitida. Debes ingresar tus credenciales.')
        else {
          console.log('> Kubelabs WEBSOCKET Connected')
          return true
        }
      }
      throw new Error('Missing auth token!')
    },
    onDisconnect: (/* webSocket, subsContext */) => {
      console.log('> Kubelabs WEBSOCKET Disconnected')
    }
  },

  formatError: err => {
    console.error('>> GQL error ', err)
    // if production return to FrontEnd only message
    // if (err.message && config.NODE_ENV === 'production') return err.message
    return err
  },
  tracing: config.NODE_ENV !== 'production'
})
