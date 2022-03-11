import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import config from './config'
import { logger } from './util/log'

const app = express()

// middlewares
app.use(express.json())
app.use(cors())
app.use(helmet())

process.on('uncaughtException', err => {
  logger.error('AHHHHHHHHHHHHHHHHHHHHHHHHHH! :', err)
  process.exit(1)
})

process.on('unhandledRejection', err => {
  logger.error('ERRRRRRRRRRRRRRRRRRRRRRRRRR! :', err)
  process.exit(1)
})

const router = express.Router()

// rest api
router.get('/private', (req, res) => {
  res.send({ response: true })
})

app.listen(3002, () => {
  logger.info(`Rest API on port 3002`)
})

// health checks
router.get('/healthcheck', (req, res) => {
  res.send({ app: config.APP_NAME, env: config.NODE_ENV, port: config.NODE_PORT, version: config.APP_VERSION })
})

app.use(router)

app.listen(3082, () => {
  logger.info(`Health check on port 3082`)
  logger.info(`Rest API on port 3002`)
})
