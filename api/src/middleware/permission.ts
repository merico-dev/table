import * as express from 'express';
import { Account } from '../api_models/account';
import { ApiKey } from '../api_models/api';
import { CHECK_PERMISSION, RoleService } from '../services/role.service';

export default function permission(requiredPermission: CHECK_PERMISSION) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const auth: Account | ApiKey | undefined = req.body.auth;
    RoleService.checkPermission(requiredPermission, req.locale, auth?.permissions);
    next();
  };
}
