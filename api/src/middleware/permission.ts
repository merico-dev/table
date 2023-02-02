import * as express from 'express';
import { ROLE_TYPES } from '../api_models/role';
import Account from '../models/account';
import ApiKey from '../models/apiKey';
import { RoleService } from '../services/role.service';

export default function permission(requiredRole: ROLE_TYPES) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const auth: Account | ApiKey | null = req.body.auth;
    RoleService.checkPermission(auth, requiredRole, req.locale);
    next();
  }
}