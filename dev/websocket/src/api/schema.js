import { gql, makeExecutableSchema } from 'apollo-server-express'
import { GraphQLDateTime } from 'graphql-iso-date'
import directives from './directives'

import access from './access'

const globalTypeDefs = gql`
  scalar Date
  type Query {
    global: String
    healthCheck: Boolean
  }
  type Mutation {
    global: String
  }
  type Subscription
`

const customDateScalarResolver = {
  Date: GraphQLDateTime
}

const healthCheck = {
  Query: {
    healthCheck: () => true
  }
}

export default makeExecutableSchema({
  typeDefs: [globalTypeDefs, directives.typeDefs, access.typeDefs],
  resolvers: [customDateScalarResolver, healthCheck, access.subscriptions],
  schemaDirectives: {
    isAuth: directives.IsAuthenticatedDirective
  }
})
