import * as express from 'express';
import { AccountService } from '../services/account.service';
import { ApiService } from '../services/api.service';

export default async function authorization(req: express.Request, res: express.Response, next: express.NextFunction) {
  // Bearer
  const auth = req.headers.authorization;
  const access_token = auth?.split(' ')[1];
  const account = await AccountService.getByToken(access_token);
  if (account !== null) {
    req.body.auth = account;
  } else {
    //ApiKey
    const key = req.headers['x-api-key'];
    const domain = req.headers.origin;
    const apiKey = await ApiService.verifyApiKey(key, domain);
    req.body.auth = apiKey;
  }
  next();
} 