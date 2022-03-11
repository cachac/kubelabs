<template>
  <div>
    <h1>Arquitectura Kubernetes</h1>
    <br />
    <!-- <img alt="Kubelabs logo" src="../assets/kubelabs.png" /> -->
    <v-zoomer style="width: 1000px; height: 500px">
      <img v-if="getLab === 1" src="../assets/parte1.png" style="object-fit: contain; width: 100%; height: 100%" />
      <img v-if="getLab === 2" src="../assets/parte2.png" style="object-fit: contain; width: 100%; height: 100%" />
      <img v-if="getLab === 3" src="../assets/parte3.png" style="object-fit: contain; width: 100%; height: 100%" />
      <img v-if="getLab === 4" src="../assets/parte4.png" style="object-fit: contain; width: 100%; height: 100%" />

      <img v-if="getLab === 41" src="../assets/parte41.png" style="object-fit: contain; width: 100%; height: 100%" />
      <img v-if="getLab === 42" src="../assets/parte42.png" style="object-fit: contain; width: 100%; height: 100%" />
    </v-zoomer>
  </div>
</template>

<script>
export default {
  computed: {
    getLab() {
      if (!this.websocket && !this.publicApi && !this.privateApi) return 1;
      if (this.websocket && !this.publicApi && !this.privateApi) return 2;
      if (this.websocket && this.publicApi && !this.privateApi) return 3;
      if (this.websocket && this.publicApi && this.privateApi) return 4;

      if (!this.websocket && this.publicApi && !this.privateApi) return 41;
      if (!this.websocket && this.publicApi && this.privateApi) return 42;


      return 1;
    },
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
};
</script>
