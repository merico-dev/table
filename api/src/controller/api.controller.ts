import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { validate } from '../middleware/validation';
import { ROLE_TYPES } from '../api_models/role';
import { ApiService } from '../services/api.service';
import { ApiKeyCreateRequest, ApiKeyIDRequest, ApiKeyListRequest } from '../api_models/api';
import permission from '../middleware/permission';
import ensureAuthEnabled from '../middleware/ensureAuthEnabled';

@ApiPath({
  path: '/api',
  name: 'API',
})
@controller('/api')
export class APIController implements interfaces.Controller {
  public static TARGET_NAME = 'API';

  @inject('ApiService')
  private apiService: ApiService;

  @ApiOperationPost({
    path: '/key/list',
    description: 'List apikeys. Only admins can view',
    parameters: {
      body: { description: 'apikey list request', required: true, model: 'ApiKeyListRequest' },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'ApiKeyPaginationResponse',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/key/list', ensureAuthEnabled, permission(ROLE_TYPES.ADMIN), validate(ApiKeyListRequest))
  public async listKeys(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { filter, sort, pagination } = req.body as ApiKeyListRequest;
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
      body: { description: 'new apikey request', required: true, model: 'ApiKeyCreateRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.STRING },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/key/create', ensureAuthEnabled, permission(ROLE_TYPES.ADMIN), validate(ApiKeyCreateRequest))
  public async createKey(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { name, role_id } = req.body as ApiKeyCreateRequest;
      const result = await this.apiService.createKey(name, role_id, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/key/delete',
    description: 'Delete apikey',
    parameters: {
      body: { description: 'delete apikey', required: true, model: 'ApiKeyIDRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiKeyIDRequest' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/key/delete', ensureAuthEnabled, permission(ROLE_TYPES.ADMIN), validate(ApiKeyIDRequest))
  public async deleteKey(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id } = req.body as ApiKeyIDRequest;
      await this.apiService.deleteKey(id, req.locale);
      res.json({ id });
    } catch (err) {
      next(err);
    }
  }
}
