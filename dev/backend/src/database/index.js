import mongoose from 'mongoose'
import config from '../config'
import { logger } from '../util/log'

mongoose.set('debug', false)

export default {
  setConnection() {
    const strconn = `mongodb://${config.DB_USER}:${config.DB_PW}@${config.DB_HOST1}:${config.DB_PORT},${config.DB_HOST2}:${config.DB_PORT},${config.DB_HOST3}:${config.DB_PORT}/${config.DB_NAME}?replicaSet=rs0&readPreference=primary`


    console.log('strconn :>> ', strconn)

    const db = mongoose.connection

    db.on('error', err => {
      logger.error('> error occurred from the database', err)
    })

    db.once('open', () => {
      logger.info('> successfully open the database')
    })

    return mongoose.connect(strconn, {
      authSource: 'admin',
      // general config
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      // connection
      socketTimeoutMS: 10000,
      keepAlive: true,
      connectTimeoutMS: 2000,
      poolSize: 500,
      // writes
      writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 10000
      },
      retryWrites: true
      // Esta conexión es local, no requiere TLS
      // ssl: config.TLS,
      // ...(config.TLS && { sslValidate: true, sslCA: config.CA_CERT, sslKey: config.CLIENT_CERT, sslCert: config.CLIENT_CERT })
    })
  }
}
