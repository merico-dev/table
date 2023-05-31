import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationGet, ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { PERMISSIONS, RoleService } from '../services/role.service';
import permission from '../middleware/permission';
import { RoleCreateOrUpdateRequest, RoleIDRequest } from '../api_models/role';
import { validate } from '../middleware/validation';

@ApiPath({
  path: '/role',
  name: 'Role',
})
@controller('/role')
export class RoleController implements interfaces.Controller {
  public static TARGET_NAME = 'Role';

  @inject('RoleService')
  private roleService: RoleService;

  @ApiOperationGet({
    path: '/list',
    description: 'List roles',
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Role' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpGet('/list')
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const result = await this.roleService.list();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationGet({
    path: '/permissions',
    description: 'List permissions',
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Permission' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpGet('/permissions')
  public async permissions(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const result = await this.roleService.permissions();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/createOrUpdate',
    description: 'Create or update role',
    parameters: {
      body: { description: 'role create request', required: true, model: 'RoleCreateOrUpdateRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Role' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/createOrUpdate',
    permission({ match: 'all', permissions: [PERMISSIONS.ROLE_MANAGE] }),
    validate(RoleCreateOrUpdateRequest),
  )
  public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id, description, permissions } = req.body as RoleCreateOrUpdateRequest;
      const result = await this.roleService.createOrUpdate(id, description, permissions);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/delete',
    description: 'Delete role',
    parameters: {
      body: { description: 'role delete request', required: true, model: 'RoleIDRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'RoleIDRequest' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/delete', permission({ match: 'all', permissions: [PERMISSIONS.ROLE_MANAGE] }), validate(RoleIDRequest))
  public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id } = req.body as RoleIDRequest;
      await this.roleService.delete(id);
      res.json({ id });
    } catch (err) {
      next(err);
    }
  }
}
