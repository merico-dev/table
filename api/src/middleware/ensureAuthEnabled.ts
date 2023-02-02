import * as express from 'express';
import { AUTH_ENABLED } from '../utils/constants';
import { ApiError, AUTH_NOT_ENABLED } from '../utils/errors';
import i18n from '../utils/i18n';

export default function ensureAuthEnabled(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!AUTH_ENABLED) {
    throw new ApiError(AUTH_NOT_ENABLED, { message: i18n.__({ phrase: 'Authentication system is not enabled', locale: req.locale }) });
  }
  next();
}