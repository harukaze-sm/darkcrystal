import type { AppProps } from "next/app";
import {
  createClient,
  dedupExchange,
  defaultExchanges,
  fetchExchange,
  Provider,
  subscriptionExchange,
} from "urql";
import { cacheExchange, Cache, QueryInput } from "@urql/exchange-graphcache";
import { WebSocketLink } from "apollo-link-ws";
import { AuthContextProvider } from "src/stores/AuthContext";
import { LogInMutation, UserDocument, UserQuery } from "src/generated/graphql";

const wsClient = process.browser
  ? new WebSocketLink({
      // if you instantiate in the server, the error will be thrown
      uri: `ws://localhost:8000/graphql`,
      options: {
        reconnect: true,
        connectionParams: {
          userId: 1,
        },
      },
    })
  : null;

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

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
    fetchExchange,
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logIn: (_result, _args, cache, _info) => {
            betterUpdateQuery<LogInMutation, UserQuery>(
              cache,
              { query: UserDocument },
              _result,
              (result, query) => {
                if (result.logIn.error) {
                  return query;
                } else {
                  return {
                    user: result.logIn.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
  ],
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <AuthContextProvider>
        <style jsx global>{`
          body {
            margin: 0px;
            padding: 0px;
          }
          @font-face {
            font-family: Nautigal;
            src: url(/fonts/TheNautigal-Regular.ttf);
          }
        `}</style>
        <Component {...pageProps} />
      </AuthContextProvider>
    </Provider>
  );
}

export default MyApp;
