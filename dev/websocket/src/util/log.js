import { createLogger, format, transports } from 'winston'
import appRoot from 'app-root-path'
import config from '../config'

const { combine, timestamp, colorize } = format

const options = {
  info: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    maxsize: 9242880, // 9MB
    maxFiles: 5,
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
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: format.combine(format.json())
  }
}

const logFormat = format.printf(
  // eslint-disable-next-line no-shadow
  ({ level, message, timestamp, label, metadata }) =>
    `${timestamp}  [${label}] [${level}] ${message}. ${
      Object.keys(metadata).length === 0 ? '' : `\n  metadata: ${JSON.stringify(metadata, null, 2)}`
    }`
)

export const logger = createLogger({
  format: combine(
    format.label({ label: config.APP_NAME }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
  ),
  transports: [new transports.File(options.info), new transports.File(options.error)],
  exitOnError: false // do not exit on handled exceptions
})

if (config.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(format.label({ label: config.APP_NAME }), colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
      ...options.console
    })
  )
}
// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  // eslint-disable-next-line no-unused-vars
  write(message, _encoding) {
    logger.info(message)
  }
}
