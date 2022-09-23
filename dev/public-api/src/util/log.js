import { createLogger, format, transports } from 'winston'
import appRoot from 'app-root-path'
import config from '../config'

const { combine, timestamp, colorize } = format

const options = {
  info: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    maxsize: 10000,
    maxFiles: 10,
    format: format.combine(format.json())
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  },
  error: {
    level: 'error',
    filename: `${appRoot}/logs/error.log`,
    handleExceptions: true,
    maxsize: 10000,
    maxFiles: 10,
    format: format.combine(format.json())
  }
}

// usado para log en pantalla
const logFormat = format.printf(
  // eslint-disable-next-line no-shadow
  ({ level, message, timestamp, label, metadata }) =>
    `${config.NODE_ENV === 'dev' ? timestamp : ''}  [${label}] [${level}] ${message}. ${
      Object.keys(metadata).length === 0 ? '' : `\n  metadata: ${JSON.stringify(metadata, null, 2)}`
    }`
)

export const logger = createLogger({
  format: combine(
    format.label({ label: 'public-API' }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
  ),
  transports: [new transports.File(options.info), new transports.File(options.error)],
  exitOnError: false
})

if (config.NODE_ENV === 'dev')
  logger.add(
    new transports.Console({
      format: combine(format.label({ label: config.APP_NAME }), colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
      ...options.console
    })
  )
else
  logger.add(
    new transports.Console({
      format: combine(format.label({ label: 'public-API' }), logFormat),
      ...options.console
    })
  )
