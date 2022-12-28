import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { resolve } from 'app-root-path'
import config from './config'
import { logger } from './util/log'
import { apolloServer } from './api'

const app = express()

// v2.0.1, sticky session hash
const sticky = (Math.random() + 1).toString(36).substring(10)
console.log('sticky', sticky)

// middlewares
app.use(express.json())
app.use(cors())
app.use(helmet())
apolloServer.applyMiddleware({ app, path: '/graphql' })

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
  logger.info(`Random Crash (0=☠️): ${  num}`)

  if (num === 0) {
    logger.info('💥')
    process.exit(1)
  }

  logger.info(`[${config.NODE_ENV}] App: ${config.APP_NAME} v${config.APP_VERSION}. Session: ${sticky} on Port 3080 => RANDOM_CRAAAASHHHH #${num}`)
  res.send({ app: config.APP_NAME, env: config.NODE_ENV, port: config.NODE_PORT, version: config.APP_VERSION, sticky, random_crash: num })
})

app.use(router)

// START server
app.listen(config.NODE_PORT, () => {
  logger.info(
    `[${config.NODE_ENV}] App: ${config.APP_NAME} v${config.APP_VERSION}. Session: ${sticky} 🚀 Server ready on Port ${config.NODE_PORT} - Express JS ${config.NODE_ENV} |  ${apolloServer.graphqlPath}`
  )
})

app.listen(3080, () => {
  logger.info(`/healthcheck on port 3080`)
})
