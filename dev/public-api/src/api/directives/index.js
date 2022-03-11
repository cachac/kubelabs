import { gql } from 'apollo-server-express'
import { IsAuthenticatedDirective } from './isAuthenticated'

const typeDefs = gql`
  directive @isAuth on FIELD_DEFINITION
`

export default {
  typeDefs,
  IsAuthenticatedDirective
}
