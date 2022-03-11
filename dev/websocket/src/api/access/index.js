import { gql } from 'apollo-server-express'
import subscriptions from './access.subscriptions'

const typeDefs = gql`
  extend type Subscription {
    accessRequest(_id: String!): String
  }
`

export default {
  typeDefs,
  subscriptions
}
