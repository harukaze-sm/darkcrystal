import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cors from 'cors';
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import { execute, subscribe } from 'graphql';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { createConnection } from 'typeorm';
import { UserResolver } from './resolvers/User';
import { ConnectionContext, SubscriptionServer } from 'subscriptions-transport-ws';
import { ENV } from './environment';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import { PostResolver } from './resolvers/post';
import { promisify } from 'util';

(async () => {
  dotenv.config();
  const app = express();
  app.use(morgan('dev'));
  app.disable('etag');
  const httpServer = createServer(app);
  let connectedUsers: number[] = [];
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
    resolvers: [HelloResolver, UserResolver, PostResolver],
    validate: false,
  });

  const GET_ASYNC = promisify<string>(redisClient.GET).bind(redisClient) as unknown as (key: string) => Promise<string | null>;

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      async onConnect(_connectionParams: any, webSocket: any) {
        if (!webSocket.upgradeReq.headers.cookie) throw new Error('unauthorized!');
        const cookies = cookie.parse(webSocket.upgradeReq.headers.cookie);
        if (!cookies.qid) throw new Error('unauthorized!');
        const qidParsed = cookieParser.signedCookie(cookies.qid, 'qwerasdf');
        if (!qidParsed) throw new Error('unauthorized!');
        const session = await GET_ASYNC(`sess:${qidParsed}`);
        if (!session) throw new Error('unauthorized!');
        const { userId }: any = JSON.parse(session!);
        if (!userId) throw new Error('unauthorized!');
        connectedUsers.push(userId);

        return { userId };
      },
      onDisconnect(_webSocket: any, _context: ConnectionContext) {
        console.info('CONTEXT?', _context);
        console.log('Disconnected!');
      },
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

  app.get('/', (_, res) => {
    res.status(200).send('running');
  });

  httpServer.listen(8000);
})();
