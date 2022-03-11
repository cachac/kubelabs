import { gql, makeExecutableSchema } from 'apollo-server-express'
import { GraphQLDateTime } from 'graphql-iso-date'
import directives from './directives'

import user from './user'

const globalTypeDefs = gql`
  scalar Date
  type Query {
    healthCheck: Boolean
  }
  type Mutation {
    healthCheck: Boolean
  }
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
  typeDefs: [globalTypeDefs, directives.typeDefs, user.typeDefs],
  resolvers: [customDateScalarResolver, healthCheck, user.resolvers],
  schemaDirectives: {
    isAuth: directives.IsAuthenticatedDirective
  }
})
