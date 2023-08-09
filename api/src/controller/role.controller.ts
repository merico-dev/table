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
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'RolePermission' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpGet('/permissions')
  public async permissions(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const result = this.roleService.permissions(req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/create',
    description: 'Create role',
    parameters: {
      body: { description: 'role create request', required: true, model: 'RoleCreateOrUpdateRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Role' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/create',
    permission({ match: 'all', permissions: [PERMISSIONS.ROLE_MANAGE] }),
    validate(RoleCreateOrUpdateRequest),
  )
  public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id, description, permissions } = req.body as RoleCreateOrUpdateRequest;
      const result = await this.roleService.create(id, description, permissions, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPut({
    path: '/update',
    description: 'Update role',
    parameters: {
      body: { description: 'role update request', required: true, model: 'RoleCreateOrUpdateRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Role' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPut(
    '/update',
    permission({ match: 'all', permissions: [PERMISSIONS.ROLE_MANAGE] }),
    validate(RoleCreateOrUpdateRequest),
  )
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id, description, permissions } = req.body as RoleCreateOrUpdateRequest;
      const result = await this.roleService.update(id, description, permissions);
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
