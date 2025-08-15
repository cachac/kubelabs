import { Hono } from 'hono'
import { logger } from '../util/log'
import { sticky } from '../util/sticky'
import config from '../config/index'

export const router = new Hono()

router.get('/healthcheck', c => c.json({ app: config.APP_NAME, version: config.APP_VERSION, sticky }))

router.get('/checkprivate', async (c, next) => {
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

  if (response) return c.json({ response })
  else {
    c.error = {
      status: 555,
      code: 3324,
      message: 'error',
      userMessage: `Error [3324] en request al private api: ${config.PRIVATE_API}`
    }
    return next()
  }
})
