<template>
  <div>
    <h1>Lista de Usuarios</h1>
    <BeeGridTable
      border
      :columns="[
        { title: 'ID', key: '_id' },
        { title: 'USER', key: 'username' },
      ]"
      :data="list"
      :pageSize="5"
      :pageCount="3"
      :showPager="true"
    >
    </BeeGridTable>
  </div>
</template>

<script>
import reactUser from "./user";

export default {
  components: {},
  setup() {
    const { list, loadData } = reactUser();
    return { list, loadData };
  },
  mounted() {
    this.loadData();
  },
};
</script>
