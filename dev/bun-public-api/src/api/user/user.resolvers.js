import config from '../../config'
import { logger } from '../../util/log'

export default {
  Query: {
    User: () => ({})
  },

  UserQuery: {
    checkPrivateApi: async () => {
      let response = false
      try {
        logger.info(`Request to Private API: ${config.PRIVATE_API}`)
        response = await fetch(config.PRIVATE_API)
          .then(res => res.json())
          .then(res => res.response)
      } catch (error) {
        logger.error(error)
      }

      if (response) logger.info('Check Private API: OK!!! 🤯')
      else logger.info('Check Private API: False 😢')

      return response || false
    },
    checkPublicApi: async () => {
      logger.info('Check Public API: OK!!! 🚀')

      return true
    }
  }
}
