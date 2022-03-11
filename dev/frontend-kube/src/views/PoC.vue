<template>
  <div class="home">
    <arch align="center"></arch>
  </div>
</template>

<script>
export default {
  name: "Home",
  components: {
    arch: () => import("../components/arch.vue"),
  },
};
</script>

<style scoped>
.token {
  background-color: #75abe4;
  width: 500px;
  display: inline-block;
  margin-top: 20px;
  padding: 25px;
  border: 2px solid navy;
}
</style>

<style lang="scss">
.inputs {
  background-color: white;
  max-width: 20em;
  padding: 2em;
  margin: 6.5em auto 2em auto;
  border-radius: 0.25em;
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.25);
}
pre {
  display: block;
  background-color: #e7f6ef;
  padding: 0.25em;
  border-radius: 0.25em;
}
html {
  min-height: 100%;
}
body {
  padding: 2em;
  background-image: url(""), linear-gradient(-45deg, #2b85e4, #ffffff);
  background-repeat: no-repeat;
  background-size: 3em, 100%;
  background-position: center 2em, center center;
}
</style>
