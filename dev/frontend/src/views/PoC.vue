<template>
  <div class="home">
    <div v-if="$session.token">
      <Tabs>
        <TabItem name="API">
          <list align="center"></list>
        </TabItem>
      </Tabs>
    </div>
    <div v-else>
      <router-link to="/register">Registro</router-link>
      <login></login>
    </div>
    <div class="token">
      <p align="left">
        App token:
        {{ !!$session.token }}
      </p>
      <p align="left">
        Username:
        {{ user.username || "null" }}
      </p>
      <p align="left">
        Pubsub:
        {{ $connectionCheck.connection.APIState ? "Conectado!!!" : "Desconectado" }}
      </p>
      <p align="left">
        App Version:
        {{ appVersion }}
      </p>
    </div>
  </div>
</template>

<script>
import reactUser from "../components/user";
import { version } from "../../package.json";
import { Tabs, TabItem } from "vue-material-tabs";

export default {
  name: "Home",
  components: {
    login: () => import("../components/login.vue"),
    list: () => import("../components/list.vue"),
    Tabs,
    TabItem,
  },
  setup() {
    const { user } = reactUser();
    return { user };
  },
  computed: {
    appVersion() {
      return version;
    },
  },
};
</script>

<style scoped>
.token {
  background-color:#75abe4;
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
