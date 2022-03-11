import { reactive, computed, toRefs } from "@vue/composition-api";
import { useRouter } from "../utils";
import { useToast } from "vue-toastification/composition";

import store from "@/store";

export default function useUser() {
  const { router } = useRouter();
  const toast = useToast();

  const reactUser = reactive({
    user: computed(() => store.state.userStore.user),
    list: computed(() => store.state.userStore.list),
    register: (item) =>
      store
        .dispatch("userStore/create", item)
        .then(() => {
          toast.success("Usuario Creado");
          router.push({ name: "Poc" });
        })
        .catch((error) => toast.error("create error: " + error)),
    login: (item) =>
      store
        .dispatch("userStore/authentication", item)
        .then(() => toast.success("Bienvenid@!"))
        .catch((error) => toast.error("authentication error: " + error)),
    loadData: () =>
      store
        .dispatch("userStore/readAll")
        .catch((error) => toast.error("read all error: " + error)),
  });

  return toRefs(reactUser);
}
