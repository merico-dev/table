import * as express from 'express';
import Account from '../models/account';
import ApiKey from '../models/apiKey';
import { ApiError, FORBIDDEN } from '../utils/errors';
import i18n from '../utils/i18n';

export default function ensureAuthIsAccount(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth: Account | ApiKey = req.body.auth;
  if (auth instanceof ApiKey) {
    throw new ApiError(FORBIDDEN, { message: i18n.__({ phrase: 'Must authenticate with bearer token', locale: req.locale }) });
  }
  next();
}