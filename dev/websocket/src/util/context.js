import jwt from 'jsonwebtoken'
import config from '../config'
// import { AuthenticationError } from 'apollo-server-express'

export default {
  verifyUser: async req => {
    const bearerHeader = req.headers ? req.headers.authorization : req

    if (bearerHeader) {
      const token = bearerHeader.split(' ')[1]
      return new Promise(resolve => {
        jwt.verify(token, config.TOKEN_SECRET, (err, decoded) => {
          if (err) return resolve(null)

          resolve({ ...decoded })
        })
      })
    }
    return null
  }
}
