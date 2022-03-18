const fs = require("fs");
const path = require("path");
const LoadTesting = require("easygraphql-load-tester");
const { fileLoader } = require("merge-graphql-schemas");

const schema = fs.readFileSync(path.join(__dirname, "schema.gql"), "utf8");

const easyGraphQLLoadTester = new LoadTesting(schema);

const check = fileLoader(path.join(__dirname, "./query/check.gql"));

const checkAPI = easyGraphQLLoadTester.artillery({
  customQueries: check,
  onlyCustomQueries: true,
  queryFile: true,
  withMutations: true,
});

module.exports = {
  checkAPI,
};
