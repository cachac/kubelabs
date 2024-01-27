// import { Hono } from 'hono'
// import { cors } from 'hono/cors'
import config from './config/index.js'
import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import resolvers from './api/user/user.resolvers.js'

const typeDefs = `#graphql
  type Query {
    healthCheck: Boolean
  }
  type Mutation {
    healthCheck: Boolean
  }
  extend type Query {
    User: UserQuery
  }

  type UserQuery {
    checkPrivateApi: Boolean
    checkPublicApi: Boolean
  }

`
const healthCheck = {
  Query: {
    healthCheck: () => true
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers: [healthCheck, resolvers]
})

await startStandaloneServer(server, {
  listen: { port: config.NODE_PORT }
})

console.log(`🚀  Server ready at: http://localhost:${config.NODE_PORT}/graphql`)

// const app = new Hono()

// app.use('*', cors())
// app.get('/healthcheck', c => c.json({ app: config.APP_NAME, version: config.APP_VERSION, sticky }))

// export default {
//   fetch: app.fetch,
//   port: 3080
// }
