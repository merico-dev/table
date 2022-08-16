import * as express from 'express';
import { inject, interfaces as inverfaces } from 'inversify';
import { controller, httpGet, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { ApiOperationGet, ApiOperationPost, ApiOperationPut, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { AccountService } from '../services/account.service';
import { validate } from '../middleware/validation';
import { AccountChangePasswordRequest, AccountEditRequest, AccountIDRequest, AccountListRequest, AccountLoginRequest } from '../api_models/account';
import { AccountCreateRequest, AccountUpdateRequest } from '../api_models/account';
import Account from '../models/account';
import { RoleService } from '../services/role.service';
import { ROLE_TYPES } from '../api_models/role';
import { ApiError, AUTH_NOT_ENABLED, BAD_REQUEST, FORBIDDEN, UNAUTHORIZED } from '../utils/errors';
import { AUTH_ENABLED } from '../utils/constants';
import { redactPassword } from '../services/account.service';

@ApiPath({
  path: '/account',
  name: 'Account'
})
@controller('/account')
export class AccountController implements interfaces.Controller {
  public static TARGET_NAME: string = 'Account';
  private accountService: AccountService;
  private roleService: RoleService;

  public constructor(
    @inject('Newable<AccountService>') AccountService: inverfaces.Newable<AccountService>,
    @inject('Newable<RoleService>') RoleService: inverfaces.Newable<RoleService>
  ) {
    this.accountService = new AccountService();
    this.roleService = new RoleService();
  }

  @ApiOperationPost({
    path: '/login',
    description: 'Account login',
    parameters: {
      body: { description: 'Login account using credentials', required: true, model: 'AccountLoginRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'AccountLoginResponse' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    }
  })
  @httpPost('/login')
  public async login(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      this.checkControllerActive();
      const { name, password } = validate(AccountLoginRequest, req.body);
      const result = await this.accountService.login(name, password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/list',
    description: 'List accounts. Only admins can view all users',
    parameters: {
      body: { description: 'account list request', required: true, model: 'AccountListRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'AccountPaginationResponse' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    }
  })
  @httpPost('/list')
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      this.checkControllerActive();
      const account: Account | null = req.body.account;
      this.roleService.checkPermission(account, ROLE_TYPES.ADMIN);
      const { filter, sort, pagination } = validate(AccountListRequest, req.body);
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
    }
  })
  @httpGet('/get')
  public async get(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      this.checkControllerActive();
      const account: Account | null = req.body.account;
      if (!account) {
        throw new ApiError(FORBIDDEN, { message: 'User not online' });
      }
      const result = redactPassword(account);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/create',
    description: 'create a new account',
    parameters: {
      body: { description: 'new account request', required: true, model: 'AccountCreateRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Account' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    }
  })
  @httpPost('/create')
  public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      this.checkControllerActive();
      const account: Account = req.body.account;
      this.roleService.checkPermission(account, ROLE_TYPES.ADMIN);
      const { name, email, password, role_id } = validate(AccountCreateRequest, req.body);
      if (account.role_id <= role_id) {
        throw new ApiError(UNAUTHORIZED, { message: 'Can not add user with similar or higher role' });
      }
      const result = await this.accountService.create(name, email, password, role_id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPut({
    path: '/update',
    description: 'update account',
    parameters: {
      body: { description: 'update own account', required: true, model: 'AccountUpdateRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Account' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    }
  })
  @httpPut('/update')
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      this.checkControllerActive();
      const account: Account = req.body.account;
      this.roleService.checkPermission(account, ROLE_TYPES.READER);
      const { name, email } = validate(AccountUpdateRequest, req.body);
      const result = await this.accountService.update(account.id, name, email);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPut({
    path: '/edit',
    description: 'Edit other account',
    parameters: {
      body: { description: 'edit other account', required: true, model: 'AccountEditRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Account' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    }
  })
  @httpPut('/edit')
  public async edit(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      this.checkControllerActive();
      const account: Account = req.body.account;
      this.roleService.checkPermission(account, ROLE_TYPES.ADMIN);
      const { id, name, email, role_id } = validate(AccountEditRequest, req.body);
      if (id === account.id) {
        throw new ApiError(BAD_REQUEST, { message: 'Editing own account. Please use /account/update instead' });
      }
      const result = await this.accountService.edit(id, name, email, role_id, account.role_id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/changepassword',
    description: 'Change account password',
    parameters: {
      body: { description: 'change password', required: true, model: 'AccountChangePasswordRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Account' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    }
  })
  @httpPost('/changepassword')
  public async changePassword(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      this.checkControllerActive();
      const account = req.body.account;
      this.roleService.checkPermission(account, ROLE_TYPES.INACTIVE);
      const { old_password, new_password } = validate(AccountChangePasswordRequest, req.body);
      const result = await this.accountService.changePassword(account.id, old_password, new_password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/delete',
    description: 'Delete account',
    parameters: {
      body: { description: 'delete account', required: true, model: 'AccountIDRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'AccountIDRequest' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    }
  })
  @httpPost('/delete')
  public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      this.checkControllerActive();
      const account = req.body.account;
      this.roleService.checkPermission(account, ROLE_TYPES.ADMIN);
      const { id } = validate(AccountIDRequest, req.body);
      if (id === account.id) {
        throw new ApiError(BAD_REQUEST, { message: 'Can not delete self' });
      }
      await this.accountService.delete(id, account.role_id);
      res.json({ id });
    } catch (err) {
      next(err);
    }
  }

  private checkControllerActive() {
    if (!AUTH_ENABLED) {
      throw new ApiError(AUTH_NOT_ENABLED, { message: 'Authentication system is not enabled' });
    }
  }
}