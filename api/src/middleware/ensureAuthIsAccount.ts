import * as express from 'express';
import { has } from 'lodash';
import { Account } from '../api_models/account';
import { ApiKey } from '../api_models/api';
import { ApiError, FORBIDDEN, UNAUTHORIZED } from '../utils/errors';
import { translate } from '../utils/i18n';

export default function ensureAuthIsAccount(req: express.Request, res: express.Response, next: express.NextFunction) {
  const auth: Account | ApiKey | undefined = req.body.auth;
  if (!auth) {
    throw new ApiError(UNAUTHORIZED, { message: translate('UNAUTHORIZED', req.locale) });
  }
  if (has(auth, 'app_id')) {
    throw new ApiError(FORBIDDEN, { message: translate('AUTH_MUST_BEARER', req.locale) });
  }
  next();
}
