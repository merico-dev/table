import * as express from 'express';
import _ from 'lodash';
import { inject, interfaces as inverfaces } from 'inversify';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { validate } from '../middleware/validation';
import { RoleService } from '../services/role.service';
import Account from '../models/account';
import { ROLE_TYPES } from '../api_models/role';
import { ApiService } from '../services/api.service';
import { checkControllerActive } from '../utils/helpers';
import { ApiKeyCreateRequest, ApiKeyIDRequest, ApiKeyListRequest } from '../api_models/api';
import ApiKey from '../models/apiKey';

@ApiPath({
  path: '/api',
  name: 'API'
})
@controller('/api')
export class APIController implements interfaces.Controller {
  public static TARGET_NAME = 'API';
  private apiService: ApiService;
  private roleService: RoleService;
  
  public constructor(
    @inject('Newable<ApiService>') ApiService: inverfaces.Newable<ApiService>,
    @inject('Newable<RoleService>') RoleService: inverfaces.Newable<RoleService>
  ) {
    this.apiService = new ApiService();
    this.roleService = new RoleService();
  }

  @ApiOperationPost({
    path: '/key/list',
    description: 'List apikeys. Only admins can view',
    parameters: {
      body: { description: 'apikey list request', required: true, model: 'ApiKeyListRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiKeyPaginationResponse' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    }
  })
  @httpPost('/key/list')
  public async listKeys(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      checkControllerActive();
      const auth: Account | ApiKey | null = req.body.auth;
      this.roleService.checkPermission(auth, ROLE_TYPES.ADMIN);
      const { filter, sort, pagination } = validate(ApiKeyListRequest, req.body);
      const result = await this.apiService.listKeys(filter, sort, pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/key/create',
    description: 'create a new apikey',
    parameters: {
      body: { description: 'new apikey request', required: true, model: 'ApiKeyCreateRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.STRING },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    }
  })
  @httpPost('/key/create')
  public async createKey(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      checkControllerActive();
      const auth: Account | ApiKey | null = req.body.auth;
      this.roleService.checkPermission(auth, ROLE_TYPES.ADMIN);
      const { name, domain, role_id } = validate(ApiKeyCreateRequest, req.body);
      const result = await this.apiService.createKey(name, domain, role_id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/key/delete',
    description: 'Delete apikey',
    parameters: {
      body: { description: 'delete apikey', required: true, model: 'ApiKeyIDRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiKeyIDRequest' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    }
  })
  @httpPost('/key/delete')
  public async deleteKey(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      checkControllerActive();
      const auth: Account | ApiKey | null = req.body.auth;
      this.roleService.checkPermission(auth, ROLE_TYPES.ADMIN);
      const { id } = validate(ApiKeyIDRequest, req.body);
      await this.apiService.deleteKey(id);
      res.json({ id });
    } catch (err) {
      next(err);
    }
  }
}