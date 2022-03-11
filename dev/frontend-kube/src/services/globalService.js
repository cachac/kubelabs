/* eslint-disable prettier/prettier */
import gql from 'graphql-tag'
import api from './apiClient'

export default class {
  constructor({ typeDefs, input, ..._t }) {
    this.readAll = () =>
      api
        .send({
          query: gql`
          query readAll {
            ${typeDefs} {
              readAll {
                ${_t.types.readAll}
              }
            }
          }
        `
        })
        .then(result => Promise.resolve(result.data.data[typeDefs].readAll))

    this.readById = _id =>
      api
        .send({
          query: gql`
          query readById($_id: ID!) {
            ${typeDefs} {
              readById(_id: $_id) {
                ${_t.types.readById}
              }
            }
          }
        `,
          variables: {
            _id
          }
        })
        .then(result => Promise.resolve(result.data.data[typeDefs].readById))

    this.create = item =>
      api
        .send({
          query: gql`
          mutation create($item: ${input}!) {
            ${typeDefs} {
              create(input: $item) {
                ${_t.types.create}
              }
            }
          }
        `,
          variables: {
            item
          }
        })
        .then(result => Promise.resolve(result.data.data[typeDefs].create))

    this.update = item =>
      api
        .send({
          query: gql`
          mutation update($item: ${input}!) {
            ${typeDefs} {
              update(input: $item) {
                ${_t.types.update}
              }
            }
          }
        `,
          variables: {
            item
          }
        })
        .then(result => Promise.resolve(result.data.data[typeDefs].update))

    this.delete = _id =>
      api
        .send({
          query: gql`
          mutation delete($_id: ID!) {
            ${typeDefs} {
              delete(_id: $_id)
            }
          }
        `,
          variables: {
            _id
          }
        })
        .then(result => Promise.resolve(result.data.data[typeDefs].delete))

    this.setState = item =>
      api
        .send({
          query: gql`
          mutation setState($item: StateInput!) {
            ${typeDefs} {
              setState(input: $item) {
                ${_t.types.setState}
              }
            }
          }
        `,
          variables: {
            item
          }
        })
        .then(result => Promise.resolve(result.data.data[typeDefs].setState))
  }
}
