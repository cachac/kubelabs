import dotEnv from 'dotenv'
import { version } from '../../package.json'

dotEnv.config()

const { APP_ENV } = process.env
let { TOKEN_SECRET } = process.env
const { NODE_PORT, APP_NAME, NODE_ENV, TOKEN_LIMIT } = JSON.parse(APP_ENV)

console.log('Env vars (con proposito de pruebas) ', JSON.parse(APP_ENV))

if (NODE_ENV !== 'dev') TOKEN_SECRET = 'PASS'

console.log('TOKEN_SECRET :>> ', TOKEN_SECRET)

export default {
  NODE_PORT,
  APP_NAME,
  NODE_ENV,
  APP_VERSION: version,
  TOKEN_LIMIT,
  TOKEN_SECRET
}
