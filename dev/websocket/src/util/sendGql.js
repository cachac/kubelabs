import { execute, makePromise } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'
import { logger } from './log'
// import gql from 'graphql-tag'
// import config from '../config'

const setHttpLink = (uri, token) =>
  new HttpLink({
    uri,
    headers: { authorization: token ? `Bearer ${token}` : '' },
    fetch
  })

export const sendGql = (uri, operator, tokenApi = null) =>
  makePromise(execute(setHttpLink(uri, tokenApi), operator))
    .then(result => {
      if (result.errors) {
        logger.error(`[7058] Error al ejecutar GQL: ${result.errors[0].message}`, result)
        throw new Error(result.errors[0].message)
      }
      return result
    })
    .catch(error => {
      logger.error(`GQL Error`, error)
      throw new Error('[7059] Ha ocurrido un error en un servicio de terceros...')
    })
