<template>
  <div>
    <router-link to="/poc">login</router-link>

    <h2>Registro</h2>
    <FormulateForm class="inputs" @submit="register">
      <FormulateInput
        v-model="user.username"
        type="text"
        name="username"
        placeholder="Nombre del usuario (sin espacios)"
        label="Usuario"
        validation="required|min:5"
      />
      <FormulateInput
        v-model="user.password"
        type="password"
        name="password"
        label="Password"
        placeholder="Password"
        validation="required|min:3,length"
        validation-name="Password"
      />
      <FormulateInput label="Enviar" type="submit" />
    </FormulateForm>
  </div>
</template>

<script>
import reactUser from "./user";

export default {
  setup() {
    const { user, register } = reactUser();
    return { user, register };
  },
};
</script>
