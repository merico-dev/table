import * as express from 'express';
import Account from '../models/account';
import ApiKey from '../models/apiKey';
import { ApiError, FORBIDDEN } from '../utils/errors';
import { translate } from '../utils/i18n';

export default function ensureAuthIsAccount(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth: Account | ApiKey = req.body.auth;
  if (auth instanceof ApiKey) {
    throw new ApiError(FORBIDDEN, { message: translate('AUTH_MUST_BEARER', req.locale) });
  }
  next();
}
