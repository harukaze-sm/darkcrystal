import { Request, Response } from 'express';

export interface ApolloContext {
  req: Request & { session: any };
  res: Response;
}
