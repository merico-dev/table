import * as express from 'express';

export default async function authorization(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  req.body.access_token = auth?.split(' ')[1];
  next();
} 