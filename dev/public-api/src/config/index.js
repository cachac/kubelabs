import dotEnv from 'dotenv'
import { version } from '../../package.json'

dotEnv.config()

const { APP_ENV } = process.env
let { PRIVATE_API } = process.env

const { NODE_PORT, APP_NAME, NODE_ENV, TOKEN_LIMIT, TOKEN_SECRET } = JSON.parse(APP_ENV)

console.log('Env vars (con proposito de pruebas) ', JSON.parse(APP_ENV))

if (NODE_ENV === 'dev') PRIVATE_API = 'http://localhost:3002/graphql'

console.log('PRIVATE_API :>> ', PRIVATE_API)

export default {
  NODE_PORT,
  APP_NAME,
  NODE_ENV,
  APP_VERSION: version,
  TOKEN_LIMIT,
  TOKEN_SECRET,
  PRIVATE_API
}
