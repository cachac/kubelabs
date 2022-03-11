import { withFilter } from 'graphql-subscriptions'
import { pubsub } from '../subscription'
import events from '../subscription/events'
import { logger } from '../../util/log'

export default {
  Subscription: {
    accessRequest: {
      subscribe: withFilter(
        (_, args) => {
          logger.info(`Kubelabs subscribed, FINGERPRINT: ${args._id}`)
          return pubsub.asyncIterator(`${events.ACCESS_REQUEST}.${args._id}`)
        },
        (payload, variables) => {
          console.log('payload :>> ', payload)
          console.log('variables :>> ', variables)
          return payload.accessRequest.toString() === variables._id.toString()
        }
      )
    }
  }
}
