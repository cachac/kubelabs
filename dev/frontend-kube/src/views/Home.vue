<template>
  <div class="home">
    <img alt="Kubelabs logo" src="../assets/kubernetes.png" />
    <h1>Kube-Labs - v{{ appVersion }}</h1>
    <br />

    <img v-if="webpage" src="../assets/ingress-webpage.png" style="object-fit: contain; width: 100px; height: 100px" />
    <img v-else src="../assets/ingress-webpage-error.png" style="object-fit: contain; width: 100px; height: 100px" />

    <img v-if="websocket" src="../assets/ingress-websocket.png" style="object-fit: contain; width: 100px; height: 100px" />
    <img v-else src="../assets/ingress-websocket-error.png" style="object-fit: contain; width: 100px; height: 100px" />

    <img v-if="publicApi" src="../assets/ingress-publicapi.png" style="object-fit: contain; width: 100px; height: 100px" />
    <img v-else src="../assets/ingress-publicapi-error.png" style="object-fit: contain; width: 100px; height: 100px" />

    <img v-if="privateApi" src="../assets/ingress-privateapi.png" style="object-fit: contain; width: 100px; height: 100px" />
    <img v-else src="../assets/ingress-privateapi-error.png" style="object-fit: contain; width: 100px; height: 100px" />
    <br />
    <input type="button" class="button" value="Test" @click="test" />
    <br />

    ENV Variables:
    <p>{{ apiLink }}</p>
    {{ wsLink }}
    <p></p>
  </div>
</template>

<script>
import { version } from "../../package";

export default {
  name: "Home",

  data() {
    return {
      appVersion: version,
      webpage: true,
      apiLink: process.env.VUE_APP_API,
      wsLink: process.env.VUE_APP_WS_URI,
    };
  },
  computed: {
    websocket() {
      return this.$connectionCheck.connection.APIState;
    },
    publicApi() {
      return this.$store.state.userStore.publicApi;
    },
		privateApi() {
			return this.$store.state.userStore.privateApi;
		},
  },
  methods: {
    test() {
      this.$store.dispatch("userStore/checkPrivateApi");
      this.$store.dispatch("userStore/checkPublicApi");
    },
  },
};
</script>

<style scoped>
img {
  padding: 5px;
  /* width: 250px; */
  width: 150px;
  height: auto;
}

.button {
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
	cursor: pointer;
}
</style>
