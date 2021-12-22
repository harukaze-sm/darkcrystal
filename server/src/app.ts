import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { createConnection } from 'typeorm';
import { UserResolver } from './resolvers/User';
import { SubscriptionServer } from 'subscriptions-transport-ws';

(async () => {
  dotenv.config();
  const app = express();
  const httpServer = createServer(app);
  await createConnection();
  //@ts-ignore

  const schema = await buildSchema({
    resolvers: [HelloResolver, UserResolver],
    validate: false,
  });

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: '/graphql',
    }
  );

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.use(morgan('dev'));
  app.disable('etag');

  app.get('/', (_, res) => {
    res.status(200).send('running');
  });

  httpServer.listen(8000);
})();
