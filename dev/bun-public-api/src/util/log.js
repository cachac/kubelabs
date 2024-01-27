/* eslint-disable no-shadow */
import winston, { createLogger, format } from 'winston'
import { sticky } from './sticky.js'
import config from '../config/index.js'

const { combine, timestamp, label, metadata, printf } = format

const logFormat = printf(
  ({ level, message, timestamp, label, metadata }) =>
    `${timestamp}  [${label}] ${level}: ${message}. ${
      metadata && Object.keys(metadata).length ? `\n  metadata: ${JSON.stringify(metadata, null, 2)}` : ''
    }`
)

export const logger = createLogger({
  level: 'debug',
  format: combine(
    label({ label: `${config.APP_NAME}-${sticky}` }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
    logFormat
  ),
  transports: [new winston.transports.Console()],
  exitOnError: false // do not exit on handled exceptions
})
