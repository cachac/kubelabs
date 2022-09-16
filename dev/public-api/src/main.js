import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
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
router.get('/', (req, res) => {
  logger.info(`[${config.NODE_ENV}] App: ${config.APP_NAME} v${config.APP_VERSION}. Session: ${sticky} on Port ${config.NODE_PORT}`)
  res.send({ app: config.APP_NAME, env: config.NODE_ENV, port: config.NODE_PORT, version: config.APP_VERSION, sticky })
})

app.use(router)

// START server
app.listen(config.NODE_PORT, () => {
  logger.info(
    `[${config.NODE_ENV}] App: ${config.APP_NAME} v${config.APP_VERSION}. Session: ${sticky} 🚀 Server ready on Port ${config.NODE_PORT} - Express JS ${config.NODE_ENV} |  ${apolloServer.graphqlPath}`
  )
})
