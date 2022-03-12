import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import config from './config'
import { apolloServer } from './api'

const app = express()
const healthCheck = express()

// middlewares
app.use(express.json())
app.use(cors())
app.use(helmet())
apolloServer.applyMiddleware({ app, path: '/websocket' })

process.on('uncaughtException', err => {
  console.error('AHHHHHHHHHHHHHHHHHHHHHHHHHH! :', err)
  process.exit(1)
})

process.on('unhandledRejection', err => {
  console.error('ERRRRRRRRRRRRRRRRRRRRRRRRRR! :', err)
  process.exit(1)
})

// START server
const serverSubscription = app.listen(config.NODE_PORT, () => {
  console.log(
    `[${config.NODE_ENV}] App: ${config.APP_NAME} v${config.APP_VERSION} 🚀 Server ready on Port ${config.NODE_PORT} - Express JS ${config.NODE_ENV} |  ${apolloServer.graphqlPath}`
  )
})

// GraphQL subscription
apolloServer.installSubscriptionHandlers(serverSubscription)

// health checks
const router = express.Router()
router.get('/healthcheck', (req, res) => {
  res.send({ app: config.APP_NAME, env: config.NODE_ENV, port: config.NODE_PORT, version: config.APP_VERSION })
})
healthCheck.use(router)
healthCheck.listen(3081, () => {
  console.log(`Health check on port 3081`)
})
