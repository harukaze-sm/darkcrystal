import type { AppProps } from "next/app";
import {
  createClient,
  defaultExchanges,
  Provider,
  subscriptionExchange,
} from "urql";
import { WebSocketLink } from "apollo-link-ws";
import { GetStaticProps, NextPageContext } from "next/types";

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
  fetchOptions: {
    credentials: "include",
  },
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

interface Context {
  ctx: NextPageContext;
}

MyApp.getInitialProps = async ({ ctx }: Context) => {
  console.info(ctx.req?.headers.cookie);
  return {};
};

export default MyApp;
