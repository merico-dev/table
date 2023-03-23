import * as express from 'express';
import { inject, interfaces as inverfaces } from 'inversify';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import {
  DashboardOwnerUpdateRequest,
  DashboardPermissionListRequest,
  DashboardPermissionUpdateRequest,
} from '../api_models/dashboard_permission';
import { ROLE_TYPES } from '../api_models/role';
import ensureAuthEnabled from '../middleware/ensureAuthEnabled';
import permission from '../middleware/permission';
import { validate } from '../middleware/validation';
import { DashboardPermissionService } from '../services/dashboard_permission.service';

@ApiPath({
  path: '/dashboard_permission',
  name: 'DashboardPermission',
})
@controller('/dashboard_permission')
export class DashboardPermissionController implements interfaces.Controller {
  public static TARGET_NAME = 'DashboardPermission';
  private dashboardPermissionService: DashboardPermissionService;

  public constructor(
    @inject('Newable<DashboardPermissionService>')
    DashboardPermissionService: inverfaces.Newable<DashboardPermissionService>,
  ) {
    this.dashboardPermissionService = new DashboardPermissionService();
  }

  @ApiOperationPost({
    path: '/list',
    description: 'List dashboard permissions',
    parameters: {
      body: {
        description: 'dashboard permission list request',
        required: true,
        model: 'DashboardPermissionListRequest',
      },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'DashboardPermissionPaginationResponse',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/list', ensureAuthEnabled, permission(ROLE_TYPES.READER))
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { filter, sort, pagination } = validate(DashboardPermissionListRequest, req.body);
      const result = await this.dashboardPermissionService.list(filter, sort, pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/updateOwner',
    description: 'Update dashboard owner',
    parameters: {
      body: {
        description: 'dashboard owner update request',
        required: true,
        model: 'DashboardOwnerUpdateRequest',
      },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'DashboardPermission',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/updateOwner', ensureAuthEnabled, permission(ROLE_TYPES.AUTHOR))
  public async updateOwner(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id, owner_id, owner_type } = validate(DashboardOwnerUpdateRequest, req.body);
      const result = await this.dashboardPermissionService.updateOwner(
        id,
        owner_id,
        owner_type,
        req.body.auth,
        req.locale,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/update',
    description: 'Update dashboard permission',
    parameters: {
      body: {
        description: 'dashboard permission update request',
        required: true,
        model: 'DashboardPermissionUpdateRequest',
      },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'DashboardPermission',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/update', ensureAuthEnabled, permission(ROLE_TYPES.AUTHOR))
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id, direction, can_view, can_edit } = validate(DashboardPermissionUpdateRequest, req.body);
      const result = await this.dashboardPermissionService.update(
        id,
        direction,
        can_view,
        can_edit,
        req.body.auth,
        req.locale,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
