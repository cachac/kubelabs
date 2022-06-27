import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import config from './config'

const app = express()

// v2.0.1, sticky session hash
const sticky = (Math.random() + 1).toString(36).substring(10)
console.log('sticky', sticky)

// middlewares
app.use(express.json())
app.use(cors())
app.use(helmet())

process.on('uncaughtException', err => {
  console.error('AHHHHHHHHHHHHHHHHHHHHHHHHHH! :', err)
  process.exit(1)
})

process.on('unhandledRejection', err => {
  console.error('ERRRRRRRRRRRRRRRRRRRRRRRRRR! :', err)
  process.exit(1)
})

const router = express.Router()

// rest api
router.get('/private', (req, res) => {
  res.send({ response: true })
})

app.listen(config.NODE_PORT, () => {
  console.log(`Rest API on port ${config.NODE_PORT}`)
})

// health checks
router.get('/healthcheck', (req, res) => {
  console.log(JSON.stringify(req.headers))

  res.send({ app: config.APP_NAME, env: config.NODE_ENV, port: config.NODE_PORT, version: config.APP_VERSION, sticky })
})

app.use(router)

app.listen(3082, () => {
  console.log(`Health check on port 3082`)
})


