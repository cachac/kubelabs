import { Hono } from 'hono'
import { cors } from 'hono/cors'
import config from './config/index.js'
import { errorHandlers } from './middlewares/errorHandlers.js'
import { router } from './routes'

const app = new Hono()

app.use('*', cors())
app.route('/', router)
app.use('*', (c, next) => errorHandlers(c, next))
app.onError((err, c) => {
  console.error('Global Aplication Error :>> ', err)
  return c.text('App Error Message', 500)
})

process.on('uncaughtException', err => {
  console.error('AHHHHHHHHHHHHHHHHHHHHHHHHHH! :', err)
  process.exit(1)
})

process.on('unhandledRejection', err => {
  console.error('ERRRRRRRRRRRRRRRRRRRRRRRRRR! :', err)
  process.exit(1)
})

console.log(`[${config.NODE_ENV}] App: ${config.APP_NAME} v${config.APP_VERSION} listening to port ${config.NODE_PORT} - BUN JS | REST 🚀`)

export default {
  fetch: app.fetch,
  port: config.NODE_PORT
}
