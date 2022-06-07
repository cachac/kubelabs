// import router from "@/router";
// eslint-disable-next-line object-curly-newline
import {
  reactive,
  getCurrentInstance,
  watch,
  toRefs,
} from "@vue/composition-api";

// Thanks: https://medium.com/better-programming/reactive-vue-routes-with-the-composition-api-18c1abd878d1
export const useRouter = () => {
  const vm = getCurrentInstance().proxy;
  const state = reactive({
    route: vm.$route,
  });

  watch(
    () => vm.$route,
    (r) => {
      state.route = r;
    }
  );

  return { ...toRefs(state), router: vm.$router };
};
