<template>
  <div class="home">
    <img alt="Kubelabs logo" src="../assets/kubernetes.png" />
    <h1>Kube-Labs</h1>
    <arch align="center"></arch>
    <p>
      Aplicación de propósito de <b>pruebas de concepto</b> en la nube. <br />
      El objetivo es implementar una arquitectura de tres capas: frontend - backend - base de datos
    </p>
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
img {
  padding: 5px;
  width: 250px;
}
</style>
