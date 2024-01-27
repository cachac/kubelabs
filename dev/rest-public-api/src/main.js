import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import config from './config/index.js'
import { logger } from './util/log.js'
import { errorHandlers } from './middlewares/errorHandlers.js'
import { sticky } from './util/sticky.js'

const app = express()

// middlewares
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(compression())

process.on('uncaughtException', err => {
  logger.error('AHHHHHHHHHHHHHHHHHHHHHHHHHH! :', err)
  process.exit(1)
})

process.on('unhandledRejection', err => {
  logger.error('ERRRRRRRRRRRRRRRRRRRRRRRRRR! :', err)
  process.exit(1)
})

// health checks
const router = express.Router()

router.get('/healthcheck', (req, res) => {
  logger.info(`[${config.NODE_ENV}] App: ${config.APP_NAME} v${config.APP_VERSION}. Session: ${sticky} on Port 3080`)
  res.send({ app: config.APP_NAME, env: config.NODE_ENV, port: config.NODE_PORT, version: config.APP_VERSION, sticky })
})

router.get('/error500', (req, res) => {
  logger.info(`[${config.NODE_ENV}] App: ${config.APP_NAME} v${config.APP_VERSION}. Session: ${sticky} on Port 3080 => Error 500`)
  res.status(500).send({ app: config.APP_NAME, env: config.NODE_ENV, port: config.NODE_PORT, version: config.APP_VERSION, sticky, error: 500 })
})

router.get('/error400', (req, res) => {
  logger.info(`[${config.NODE_ENV}] App: ${config.APP_NAME} v${config.APP_VERSION}. Session: ${sticky} on Port 3080 => Error 400`)
  res.status(400).send({ app: config.APP_NAME, env: config.NODE_ENV, port: config.NODE_PORT, version: config.APP_VERSION, sticky, error: 400 })
})

router.get('/delay', async (req, res) => {
  const { seconds } = req.query
  logger.info(`[${config.NODE_ENV}] App: ${config.APP_NAME} v${config.APP_VERSION}. Session: ${sticky} on Port 3080 => delay ${seconds} seconds`)

  await new Promise(resolve => setTimeout(resolve, seconds * 1000))

  res.send({ app: config.APP_NAME, env: config.NODE_ENV, port: config.NODE_PORT, version: config.APP_VERSION, sticky, delay: seconds })
})

router.get('/crash', (req, res) => {
  logger.info(`[${config.NODE_ENV}] App: ${config.APP_NAME} v${config.APP_VERSION}. Session: ${sticky} on Port 3080 => CRAAAASHHHH`)
  process.exit(1)
})

router.get('/random_crash', (req, res) => {
  const num = Math.floor(Math.random() * 5)
  logger.info(`Random Crash (0=☠️): ${num}`)

  if (num === 0) {
    logger.info('💥')
    process.exit(1)
  }

  logger.info(`[${config.NODE_ENV}] App: ${config.APP_NAME} v${config.APP_VERSION}. Session: ${sticky} on Port 3080 => RANDOM_CRAAAASHHHH #${num}`)
  res.send({ app: config.APP_NAME, env: config.NODE_ENV, port: config.NODE_PORT, version: config.APP_VERSION, sticky, random_crash: num })
})

router.get('/checkprivate', async (req, res) => {
  logger.info(`Request to Private API: ${config.PRIVATE_API}`)
  let response = false
  try {
    response = await fetch(config.PRIVATE_API)
      .then(res => res.json())
      .then(res => res.response)
  } catch (error) {
    logger.error(error)
  }

  console.log('response', response)

  if (response) logger.info('Check Private API: OK!!! 🤯')
  else logger.info('Check Private API: False 😢')

  res.send({ response } || { response: false })
})

app.use(router)
app.use(errorHandlers)

// START server
app.listen(config.NODE_PORT, () => {
  logger.info(
    `[${config.NODE_ENV}] App: ${config.APP_NAME} v${config.APP_VERSION}. Session: ${sticky} 🚀 Server ready on Port ${config.NODE_PORT} - Express JS ${config.NODE_ENV}`
  )
})

app.listen(3080, () => {
  logger.info(`/healthcheck on port 3080`)
})
