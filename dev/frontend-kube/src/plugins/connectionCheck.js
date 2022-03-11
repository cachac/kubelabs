/* eslint-disable no-console */
import { execute } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import gql from "graphql-tag";
import { Session } from "./session";

const Connection = {
  APIState: false,
  isOnLine: false,
  online() {
    this.APIState = true;
  },
  offline() {
    this.APIState = false;
  },
};

const wsUri =
  process.env.NODE_ENV !== "development"
    ? config.VUE_APP_WS_URI
    : process.env.VUE_APP_WS_URI;

console.log("wsUri :>> ", wsUri);

const authToken = () => {
  const userToken = Session.get();
  if (userToken) return `Bearer ${userToken}`;
  return "";
};

const wsClient = new SubscriptionClient(wsUri, {
  reconnect: true,
  connectionParams: () => ({ authToken: authToken() }),
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
    complete: () => console.log("Suscripcion finalizada 🤷‍♀️ "),
  });
};

wsClient.onConnected(() => {
  Connection.APIState = true;
});
wsClient.onReconnected(() => {
  console.log("onReconnected");
  Connection.APIState = true;
});
wsClient.onDisconnected(() => {
  console.log("onDisconnected");
  Connection.APIState = false;
});
wsClient.onError((err) => {
  console.log("onError", { err });
  Connection.APIState = false;
});

export default {
  install(Vue /* options * */) {
    const app = new Vue({
      data() {
        return {
          connection: Connection,
          onLine: navigator.onLine,
          showBackOnline: false,
          showAPIBackOnline: false,
        };
      },
      watch: {
        onLine(v) {
          if (v) {
            this.showBackOnline = true;
            setTimeout(() => {
              this.showBackOnline = false;
            }, 10000);
          }
        },
        "connection.Status": function (v) {
          if (v) {
            this.showAPIBackOnline = true;
            setTimeout(() => {
              this.showAPIBackOnline = false;
            }, 10000);
          }
        },
      },
      methods: {
        start(_id) {
          runSubscription({
            query: gql`
              subscription connectionCheck($_id: ID!) {
                connectionCheck(_id: $_id)
              }
            `,
            variables: { _id },
          });
          window.addEventListener("online", this.updateOnlineStatus);
          window.addEventListener("offline", this.updateOnlineStatus);
        },
        updateOnlineStatus(e) {
          const { type } = e;
          this.onLine = type === "online";
        },
      },
    });
    Vue.prototype.$connectionCheck = app;
  },
};
