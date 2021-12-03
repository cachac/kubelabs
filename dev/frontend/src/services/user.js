import gql from "graphql-tag";
import api from "./apiClient";

// import { runSubscription } from './subscriber'

import globalService from "./globalService";

// eslint-disable-next-line new-cap
const user = new globalService({
  typeDefs: "User",
  input: "UserInput",
  types: {
    readAll: `_id
              username
              fullname
              state`,
    readById: `_id
               username
               fullname
               email
               state`,
    create: `_id
             username
             token
             state`,
    update: `_id
             username
             fullname
             state`,
    setState: `_id
             username
             fullname
             state`,
  },
});

export default {
  ...user,

  authentication: (credenciales) =>
    api
      .send({
        query: gql`
          mutation login($credenciales: LoginInput!) {
            User {
              login(input: $credenciales) {
                token
                _id
                username
                state
              }
            }
          }
        `,
        variables: {
          credenciales,
        },
      })
      .then((result) => {
        localStorage.setItem(
          "sf-session-first",
          // eslint-disable-next-line prettier/prettier
          `Bienvenido a ICE Cloud ${result.data.data.User.login
            .fullname || ""}`
        );
        return Promise.resolve(result.data.data.User.login);
      }),

  checkPassword: (item) =>
    api
      .send({
        query: gql`
          query checkPassword($item: CheckPassword!) {
            User {
              checkPassword(input: $item)
            }
          }
        `,
        variables: {
          item,
        },
      })
      .then((result) => Promise.resolve(result.data.data.User.checkPassword)),

  changePassword: (item) =>
    api
      .send({
        query: gql`
          mutation changePassword($item: CheckPassword!) {
            User {
              changePassword(input: $item)
            }
          }
        `,
        variables: {
          item,
        },
      })
      .then((result) => Promise.resolve(result.data.data.User.changePassword)),
};
