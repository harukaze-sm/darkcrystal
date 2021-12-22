import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  createClient,
  defaultExchanges,
  Provider,
  subscriptionExchange,
} from "urql";
import { WebSocketLink } from "apollo-link-ws";

const wsClient = process.browser
  ? new WebSocketLink({
      // if you instantiate in the server, the error will be thrown
      uri: `ws://localhost:8000/graphql`,
      options: {
        reconnect: true,
      },
    })
  : null;

const client = createClient({
  url: "http://localhost:8000/graphql",
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      //@ts-ignore
      forwardSubscription: (operation) => wsClient?.request(operation),
    }),
  ],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
