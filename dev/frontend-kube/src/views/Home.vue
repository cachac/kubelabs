<template>
  <div class="home">
    <img alt="Kubelabs logo" src="../assets/kubernetes.png" />
    <h1>Kube-Labs - v{{ appVersion }}</h1>

    <img v-if="test.webpage" src="../assets/ingress-webpage.png" style="object-fit: contain; width: 100px; height: 100px" />
    <img v-else src="../assets/ingress-webpage-error.png" style="object-fit: contain; width: 100px; height: 100px" />

    <img v-if="test.websocket" src="../assets/ingress-websocket.png" style="object-fit: contain; width: 100px; height: 100px" />
    <img v-else src="../assets/ingress-websocket-error.png" style="object-fit: contain; width: 100px; height: 100px" />

    <img v-if="test.publicapi" src="../assets/ingress-publicapi.png" style="object-fit: contain; width: 100px; height: 100px" />
    <img v-else src="../assets/ingress-publicapi-error.png" style="object-fit: contain; width: 100px; height: 100px" />

    <img v-if="test.privateapi" src="../assets/ingress-privateapi.png" style="object-fit: contain; width: 100px; height: 100px" />
    <img v-else src="../assets/ingress-privateapi-error.png" style="object-fit: contain; width: 100px; height: 100px" />
    <br />
    <p>
      Aplicación de propósito de <b>pruebas de concepto</b> en la nube. <br />
      El objetivo es implementar una arquitectura de microservicios en Kubernetes
    </p>
  </div>
</template>

<script>
import { version } from "../../package";

export default {
  name: "Home",

  data() {
    return {
      appVersion: version,
      test: {
        webpage: true,
        publicapi: false,
        websocket: false,
        privateapi: false,
      },
    };
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
</style>
