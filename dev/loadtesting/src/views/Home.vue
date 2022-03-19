<template>
  <div class="home">
    <h1>Kubelabs - Load Testing Tool</h1>
    <h1>v{{ appVersion }}</h1>
    <div class="content">
      <vue-svg-gauge
        :start-angle="-110"
        :end-angle="110"
        :value="info.value"
        :separator-step="0"
        :min="0"
        :max="30"
        :gauge-color="info.color"
        :scale-interval="1"
      />
    </div>
  </div>
</template>

<script>
import { version } from "../../package";
import { VueSvgGauge } from "vue-svg-gauge";

export default {
  name: "Home",
  components: {
    VueSvgGauge,
  },
  data() {
    return {
      appVersion: version,
      info: {
        value: 20,
        color: "#8CDFAD",
      },
    };
  },
};
</script>

<style scoped>
.content {
  margin: 0 auto;
  padding: 50px;
  width: 600px;
  height: auto;
}
</style>
