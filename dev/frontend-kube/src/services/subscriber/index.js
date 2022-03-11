/* eslint-disable no-console */
import { execute } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";

const wsUri =
  process.env.NODE_ENV !== "development"
    ? config.WEBSOCKET
    : process.env.VUE_APP_WS_URI;

console.log("wsUri :>> ", wsUri);

const wsClient = new SubscriptionClient(wsUri, {
  reconnect: true,
});
const wsLink = new WebSocketLink(wsClient);

export const runSubscription = (operator, fn) => {
  execute(wsLink, operator).subscribe({
    next: (data) => {
      if (data.errors) {
        return fn(data.errors);
      }
      return fn(null, data);
    },
    error: (error) =>
      console.log("Error no administrado en la suscripción 😢", error),
    complete: () => {
      console.log("Suscripcion finalizada 🤷‍♀️ ");
    },
  });
};

/* const errorsToArray = data =>
  data.errors.reduce((arr, item) => {
    arr.push({
      type: 'danger',
      message: item.message || 'Error general de la aplicación :(',
      icon: 'fa fa-cloud-showers-heavy'
    })

    return arr
  }, [])
 */
