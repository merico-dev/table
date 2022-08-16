import * as express from 'express';
import { AccountService } from '../services/account.service';

export default async function authorization(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth = req.headers.authorization;
  const access_token = auth?.split(' ')[1];
  req.body.account = await AccountService.getByToken(access_token);
  next();
} 