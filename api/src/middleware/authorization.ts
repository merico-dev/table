import * as express from 'express';
import { Authentication } from '../api_models/base';
import { AccountService } from '../services/account.service';
import { ApiService } from '../services/api.service';
import { validateClass } from './validation';

export default async function authorization(req: express.Request, res: express.Response, next: express.NextFunction) {
  // Bearer
  const auth = req.headers.authorization;
  const access_token = auth?.split(' ')[1];
  const account = await AccountService.getByToken(access_token);
  if (account) {
    req.body.auth = account;
  } else {
    //ApiKey
    const { authentication, ...rest } = req.body;
    try {
      if (authentication !== undefined) {
        const keyData = validateClass(Authentication, authentication);
        const apiKey = await ApiService.verifyApiKey(keyData, rest);
        req.body.auth = apiKey;
      }
    } catch (error) {
      // Don't do anything
    }
  }
  next();
}
