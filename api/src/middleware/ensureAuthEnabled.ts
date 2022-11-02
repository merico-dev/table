import * as express from 'express';
import { AUTH_ENABLED } from '../utils/constants';
import { ApiError, AUTH_NOT_ENABLED } from '../utils/errors';

export default function ensureAuthEnabled(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!AUTH_ENABLED) {
    throw new ApiError(AUTH_NOT_ENABLED, { message: 'Authentication system is not enabled' });
  }
  next();
}