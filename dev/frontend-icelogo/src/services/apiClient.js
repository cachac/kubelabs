/* eslint-disable no-console */
import axios from "axios";
import { print } from "graphql";
import { Session } from "../plugins/session";
// import { apiCall } from '../plugins/apiCall'

const baseURL = () => process.env.VUE_APP_API;

console.log("baseURL() :>> ", baseURL());

const apiClient = axios.create({
  baseURL: baseURL(),
  method: "post",
  headers: {
    Accept: "*/*",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

apiClient.send = ({ query, variables }) =>
  apiClient.post(baseURL(), { query: print(query), variables });

apiClient.interceptors.request.use((request) => {
  // apiCall.start()
  const userToken = Session.get();

  if (userToken) request.headers.Authorization = `Bearer ${userToken}`;

  return request;
});

apiClient.interceptors.response.use(
  (response) => {
    // apiCall.done()
    if (response.data.errors) return errorHandler(response);

    return response;
  },
  (err) => errorHandler(err)
);

const errorHandler = (err) => {
  // apiCall.done()
  const errorGetter = err.response || err.error || err;
  let logout = false;

  // errores graphql
  if (errorGetter.data) {
    const errString = errorGetter.data.errors.reduce((str, item) => {
      if (item.extensions.code === "UNAUTHENTICATED") logout = true;
      str += `${item.message}\r\n` || "Error general de la aplicación :(\r\n";

      return str;
    }, "");

    console.log("errString :>> 🤦‍♀️", errString);
    if (logout) {
      setTimeout(() => {
        Session.end();
      }, 2000);
    }

    if (errString) {
      return Promise.reject(new Error(errString));
    }
    return Promise.reject(new Error("graphql intercepted error"));
  }

  // error de conexión con el servidor.
  if (err.message === "Network Error") {
    console.log("err.message :>> 🤷‍♀️ ", err.message);
    return Promise.reject(new Error("Network Error"));
  }

  // error no administrado.
  console.log("Error no administrado 😢", err);
  return Promise.reject(
    new Error("Error general 😢... favor probar nuevamente.")
  );
};

export default apiClient;
