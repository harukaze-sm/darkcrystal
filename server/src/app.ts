import "reflect-metadata";
import express from "express";
import morgan from "morgan";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { createConnection } from "typeorm";
import { UserResolver } from "./resolvers/User";

(async () => {
  const app = express();
  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.use(morgan("dev"));
  app.disable("etag");

  app.get("/", (_, res) => {
    res.status(200).send("running");
  });

  app.listen(8000);
})();
