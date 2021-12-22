import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { createConnection } from 'typeorm';
import { UserResolver } from './resolvers/User';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { ENV } from './environment';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

(async () => {
  dotenv.config();
  const app = express();
  const httpServer = createServer(app);
  await createConnection();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    cors({
      origin: ['http://localhost:3000', 'https://studio.apollographql.com'],
      credentials: true,
    })
  );

  app.use(
    session({
      name: 'qid',
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        secure: ENV === 'production',
        sameSite: 'lax',
      },
      secret: 'qwerasdf',
      saveUninitialized: false,
      resave: false,
    })
  );

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
      ApolloServerPluginLandingPageGraphQLPlayground,
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

  apolloServer.applyMiddleware({ app, cors: false });

  app.use(morgan('dev'));
  app.disable('etag');

  app.get('/', (_, res) => {
    res.status(200).send('running');
  });

  httpServer.listen(8000);
})();
