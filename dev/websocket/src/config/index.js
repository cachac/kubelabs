import dotEnv from 'dotenv'
import { version } from '../../package.json'

dotEnv.config()

const { APP_ENV } = process.env
const {
  NODE_PORT,
  APP_NAME,
  NODE_ENV,
  TOKEN_LIMIT,
  TOKEN_SECRET,
  DB_HOST1,
  DB_HOST2,
  DB_HOST3,
  DB_USER,
  DB_PW,
  DB_NAME,
  DB_PORT1,
  DB_PORT2,
  DB_PORT3,
  TLS,
  ENCRYPTION_KEY
} = JSON.parse(APP_ENV)

console.log('Env vars (con proposito de pruebas) ', JSON.parse(APP_ENV))

export default {
  NODE_PORT,
  APP_NAME,
  NODE_ENV,
  APP_VERSION: version,
  TOKEN_LIMIT,
  TOKEN_SECRET,
  DB_HOST1,
  DB_HOST2,
  DB_HOST3,
  DB_USER,
  DB_PW,
  DB_NAME,
  DB_PORT1,
  DB_PORT2,
  DB_PORT3,
  TLS,
  ENCRYPTION_KEY
}
