import { ApolloServer } from 'apollo-server-express'
import { logger } from '../util/log'
import config from '../config'
import schema from './schema'

export const apolloServer = new ApolloServer({
  schema,
  playground: config.NODE_ENV !== 'production',

  formatError: err => {
    logger.error('>> GQL error ', err)
    // if production return to FrontEnd only message
    // if (err.message && config.NODE_ENV === 'production') return err.message
    return err
  },
  tracing: config.NODE_ENV !== 'production'
})
