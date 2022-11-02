import * as express from 'express';
import Account from '../models/account';
import ApiKey from '../models/apiKey';
import { ApiError, FORBIDDEN } from '../utils/errors';

export default function ensureAuthIsAccount(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth: Account | ApiKey = req.body.auth;
  if (auth instanceof ApiKey) {
    throw new ApiError(FORBIDDEN, { message: 'Must authenticate with bearer token' });
  }
  next();
}