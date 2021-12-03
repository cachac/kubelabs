// sass-loader, node-sass errors
// npm i -D sass sass-loader@7 instead of npm i -D node-sass
// https://stackoverflow.com/questions/59774544/error-when-installing-node-sass-for-vue-js-project

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        implementation: require("sass"),
      },
    },
  },
};
