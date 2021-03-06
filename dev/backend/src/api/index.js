import { ApolloServer } from 'apollo-server-express'
// import Dataloader from 'dataloader'
// import loaders from './loaders'
import { logger } from '../util/log'
import config from '../config'
import context from '../util/context'
import schema from './schema'

export const apolloServer = new ApolloServer({
  schema,
  playground: config.NODE_ENV !== 'production',
  context: async ({ req }) => ({
    userSession: req ? await context.verifyUser(req) : null
    // loaders: {
    //   gqlObj: new Dataloader(keys => loaders.batchTypes(keys, 'gqlObj')),
    // }
  }),

  formatError: err => {
    logger.error('>> GQL error ', err)
    // if production return to FrontEnd only message
    // if (err.message && config.NODE_ENV === 'production') return err.message
    return err
  },
  tracing: config.NODE_ENV !== 'production'
})
