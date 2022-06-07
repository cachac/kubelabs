<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/poc">PoC</router-link>
    </div>
    <router-view />
  </div>
</template>
<script>
import { provideToast } from "vue-toastification/composition";
import "vue-toastification/dist/index.css";

export default {
  setup() {
    provideToast({
      // hideProgressBar: true,
      closeOnClick: false,
      closeButton: false,
      icon: false,
      timeout: 3000,
      transition: "Vue-Toastification__fade",
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #2b85e4;
}

body {
  padding: 2em;
	/* Color fondo: #2b85e4 */
	/* Nuevo color #5be44f */
  background-image: url(""), linear-gradient(-45deg, #2b85e4, #ffffff);
  background-repeat: no-repeat;
	height: 100vh;
  background-size: 3em, 100%;
  background-position: center 2em, center center;
}
</style>

<style lang="scss">
@import "../node_modules/@braid/vue-formulate/themes/snow/snow.scss";
</style>
