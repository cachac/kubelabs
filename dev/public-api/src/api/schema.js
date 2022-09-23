import { gql, makeExecutableSchema } from 'apollo-server-express'
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
const healthCheck = {
  Query: {
    healthCheck: () => true
  }
}

export default makeExecutableSchema({
  typeDefs: [globalTypeDefs, directives.typeDefs, user.typeDefs],
  resolvers: [healthCheck, user.resolvers],
  schemaDirectives: {
    isAuth: directives.IsAuthenticatedDirective
  }
})
