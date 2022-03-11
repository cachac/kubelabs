import dotEnv from 'dotenv'
import { version } from '../../package.json'

dotEnv.config()

const { APP_ENV } = process.env
const {
  NODE_PORT,
  APP_NAME,
  NODE_ENV,
  TOKEN_LIMIT,
  TOKEN_SECRET
} = JSON.parse(APP_ENV)

console.log('Env vars (con proposito de pruebas) ', JSON.parse(APP_ENV))

export default {
  NODE_PORT,
  APP_NAME,
  NODE_ENV,
  APP_VERSION: version,
  TOKEN_LIMIT,
  TOKEN_SECRET
}
