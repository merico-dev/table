import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiOperationPut,
  ApiPath,
  SwaggerDefinitionConstant,
} from 'swagger-express-ts';
import { AccountService } from '../services/account.service';
import { validate } from '../middleware/validation';
import {
  Account,
  AccountCreateRequest,
  AccountUpdateRequest,
  AccountChangePasswordRequest,
  AccountEditRequest,
  AccountIDRequest,
  AccountListRequest,
  AccountLoginRequest,
} from '../api_models/account';
import { ApiError, BAD_REQUEST } from '../utils/errors';
import permission from '../middleware/permission';
import ensureAuthIsAccount from '../middleware/ensureAuthIsAccount';
import ensureAuthEnabled from '../middleware/ensureAuthEnabled';
import { translate } from '../utils/i18n';
import { PERMISSIONS } from '../services/role.service';

@ApiPath({
  path: '/account',
  name: 'Account',
})
@controller('/account')
export class AccountController implements interfaces.Controller {
  public static TARGET_NAME = 'Account';

  @inject('AccountService')
  private accountService: AccountService;

  @ApiOperationPost({
    path: '/login',
    description: 'Account login',
    parameters: {
      body: { description: 'Login account using credentials', required: true, model: 'AccountLoginRequest' },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'AccountLoginResponse',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/login', ensureAuthEnabled, validate(AccountLoginRequest))
  public async login(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { name, password } = req.body as AccountLoginRequest;
      const result = await this.accountService.login(name, password, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/list',
    description: 'List accounts. Only admins can view all users',
    parameters: {
      body: { description: 'account list request', required: true, model: 'AccountListRequest' },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'AccountPaginationResponse',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/list',
    ensureAuthEnabled,
    permission({ match: 'all', permissions: [PERMISSIONS.ACCOUNT_LIST] }),
    validate(AccountListRequest),
  )
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { filter, sort, pagination } = req.body as AccountListRequest;
      const result = await this.accountService.list(filter, sort, pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationGet({
    path: '/get',
    description: 'Get account info',
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Account' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpGet('/get', ensureAuthEnabled, ensureAuthIsAccount)
  public async get(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      res.json(req.body.auth);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/create',
    description: 'create a new account',
    parameters: {
      body: { description: 'new account request', required: true, model: 'AccountCreateRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Account' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/create',
    ensureAuthEnabled,
    permission({ match: 'all', permissions: [PERMISSIONS.ACCOUNT_MANAGE] }),
    validate(AccountCreateRequest),
  )
  public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { name, email, password, role_id } = req.body as AccountCreateRequest;
      const result = await this.accountService.create(name, email, password, role_id, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPut({
    path: '/update',
    description: 'update account',
    parameters: {
      body: { description: 'update own account', required: true, model: 'AccountUpdateRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Account' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPut(
    '/update',
    ensureAuthEnabled,
    ensureAuthIsAccount,
    permission({ match: 'all', permissions: [PERMISSIONS.ACCOUNT_UPDATE] }),
    validate(AccountUpdateRequest),
  )
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const account: Account = req.body.auth;
      const { name, email } = req.body as AccountUpdateRequest;
      const result = await this.accountService.update(account.id, name, email, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPut({
    path: '/edit',
    description: 'Edit other account',
    parameters: {
      body: { description: 'edit other account', required: true, model: 'AccountEditRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Account' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPut(
    '/edit',
    ensureAuthEnabled,
    ensureAuthIsAccount,
    permission({ match: 'all', permissions: [PERMISSIONS.ACCOUNT_MANAGE] }),
    validate(AccountEditRequest),
  )
  public async edit(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const account: Account = req.body.auth;
      const { id, name, email, role_id, reset_password, new_password } = req.body as AccountEditRequest;
      if (id === account.id) {
        throw new ApiError(BAD_REQUEST, { message: translate('ACCOUNT_NO_EDIT_SELF', req.locale) });
      }
      const result = await this.accountService.edit(id, name, email, role_id, reset_password, new_password, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/changepassword',
    description: 'Change account password',
    parameters: {
      body: { description: 'change password', required: true, model: 'AccountChangePasswordRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Account' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/changepassword',
    ensureAuthEnabled,
    ensureAuthIsAccount,
    permission({ match: 'all', permissions: [PERMISSIONS.ACCOUNT_CHANGEPASSWORD] }),
    validate(AccountChangePasswordRequest),
  )
  public async changePassword(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const account: Account = req.body.auth;
      const { old_password, new_password } = req.body as AccountChangePasswordRequest;
      if (new_password.length < 8) {
        throw new ApiError(BAD_REQUEST, {
          message: translate('ACCOUNT_PWD_LENGTH_SHOULD_BE_GRATER_THAN_8', req.locale),
        });
      }
      const result = await this.accountService.changePassword(account.id, old_password, new_password, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/delete',
    description: 'Delete account',
    parameters: {
      body: { description: 'delete account', required: true, model: 'AccountIDRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'AccountIDRequest' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/delete',
    ensureAuthEnabled,
    ensureAuthIsAccount,
    permission({ match: 'all', permissions: [PERMISSIONS.ACCOUNT_MANAGE] }),
    validate(AccountIDRequest),
  )
  public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const account: Account = req.body.auth;
      const { id } = req.body as AccountIDRequest;
      if (id === account.id) {
        throw new ApiError(BAD_REQUEST, { message: translate('ACCOUNT_NO_DELETE_SELF', req.locale) });
      }
      await this.accountService.delete(id, req.locale);
      res.json({ id });
    } catch (err) {
      next(err);
    }
  }
}
