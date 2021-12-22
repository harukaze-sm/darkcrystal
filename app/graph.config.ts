import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import fetch from "isomorphic-unfetch";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
// import { parseCookies } from "nookies";

// const SERVER = process.env.GRAPHQL_SERVER;
const HTTP_URI = `http://localhost:8000/graphql`;
const WS_URI = `ws://localhost:8000/graphql`;
// const COOKIE_JWT_TOKEN = process.env.COOKIE_JWT_TOKEN;

export default function createApolloClient(ctx: any) {
  const ssrMode = typeof window === "undefined";

  let link, token;
  if (ssrMode) {
    // on Server...
    // token = parseCookies(ctx)[COOKIE_JWT_TOKEN];
    link = new HttpLink({
      uri: HTTP_URI,
      credentials: "same-origin",
      //   headers: {
      //     authorization: token ? `Bearer ${token}` : "",
      //   },
      fetch,
    });
  } else {
    // on Client...
    // token = parseCookies()[COOKIE_JWT_TOKEN];
    const client = new SubscriptionClient(WS_URI, {
      reconnect: true,
      //   connectionParams: {
      //     headers: {
      //       authorization: token ? `Bearer ${token}` : "",
      //     },
      //   },
    });
    link = new WebSocketLink(client);
  }

  return new ApolloClient({
    ssrMode,
    link,
    cache: new InMemoryCache().restore({}),
  });
}
