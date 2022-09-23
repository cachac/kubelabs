import config from '../../config'
import { logger } from '../../util/log'

const axios = require('axios')

export default {
  Query: {
    User: () => ({})
  },

  UserQuery: {
    checkPrivateApi: async () => {
      let response = false
      try {
        logger.info(`Request to Private API: ${config.PRIVATE_API}`)
        response = await axios.get(config.PRIVATE_API)
      } catch (error) {
        logger.error(error)
      }

      if (response && response.data.response) logger.info('Check Private API: OK!!! 🤯')
      else logger.info('Check Private API: False 😢')

      return response ? response.data.response : false
    },
    checkPublicApi: async () => {
      logger.info('Check Public API: OK!!! 🚀')

      return true
    }
  }
}
