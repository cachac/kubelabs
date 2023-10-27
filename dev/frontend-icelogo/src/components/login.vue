<template>
  <div>
    <h2>Login</h2>
    <FormulateForm class="inputs" @submit="login">
      <FormulateInput
        v-model="user.username"
        type="text"
        name="username"
        placeholder="Nombre del usuario (sin espacios)"
        label="Usuario"
        validation="required"
      />
      <FormulateInput
        v-model="user.password"
        type="password"
        name="password"
        label="Password"
        placeholder="Password"
        validation="required"
        validation-name="Password"
      />
      <FormulateInput label="Login" type="submit" />
    </FormulateForm>
  </div>
</template>

<script>
import reactUser from "./user";

export default {
  setup() {
    const { user, login } = reactUser();
    return { user, login };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
