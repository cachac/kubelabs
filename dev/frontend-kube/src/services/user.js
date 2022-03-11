import gql from "graphql-tag";
import api from "./apiClient";

export default {
  checkPublicApi: () =>
    api
      .send({
        query: gql`
          query checkPublicApi {
            User {
              checkPublicApi
            }
          }
        `,
      })
      .then((result) => Promise.resolve(result.data.data.User.checkPublicApi)),

  checkPrivateApi: () =>
    api
      .send({
        query: gql`
          query checkPrivateApi {
            User {
              checkPrivateApi
            }
          }
        `,
      })
      .then((result) => Promise.resolve(result.data.data.User.checkPrivateApi)),
};
