import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import {
  DashboardOwnerUpdateRequest,
  DashboardPermissionGetRequest,
  DashboardPermissionListRequest,
  DashboardPermissionUpdateRequest,
} from '../api_models/dashboard_permission';
import ensureAuthEnabled from '../middleware/ensureAuthEnabled';
import permission from '../middleware/permission';
import { validate } from '../middleware/validation';
import { DashboardPermissionService } from '../services/dashboard_permission.service';
import { PERMISSIONS } from '../services/role.service';
import { ApiKey } from '../api_models/api';
import { Account } from '../api_models/account';

@ApiPath({
  path: '/dashboard_permission',
  name: 'DashboardPermission',
})
@controller('/dashboard_permission')
export class DashboardPermissionController implements interfaces.Controller {
  public static TARGET_NAME = 'DashboardPermission';

  @inject('DashboardPermissionService')
  private dashboardPermissionService: DashboardPermissionService;

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
  @httpPost(
    '/list',
    ensureAuthEnabled,
    permission({ match: 'all', permissions: [PERMISSIONS.DASHBOARD_VIEW] }),
    validate(DashboardPermissionListRequest),
  )
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { filter, sort, pagination } = req.body as DashboardPermissionListRequest;
      const result = await this.dashboardPermissionService.list(filter, sort, pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/get',
    description: 'Get a dashboard permission by ID',
    parameters: {
      body: {
        description: 'dashboard permission get request',
        required: true,
        model: 'DashboardPermissionGetRequest',
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
  @httpPost(
    '/get',
    ensureAuthEnabled,
    permission({ match: 'all', permissions: [PERMISSIONS.DASHBOARD_VIEW] }),
    validate(DashboardPermissionGetRequest),
  )
  public async get(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id } = req.body as DashboardPermissionGetRequest;
      const result = await this.dashboardPermissionService.get(id);
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
  @httpPost(
    '/updateOwner',
    ensureAuthEnabled,
    permission({ match: 'all', permissions: [PERMISSIONS.DASHBOARD_MANAGE] }),
    validate(DashboardOwnerUpdateRequest),
  )
  public async updateOwner(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id, owner_id, owner_type } = req.body as DashboardOwnerUpdateRequest;
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
  @httpPost(
    '/update',
    ensureAuthEnabled,
    permission({ match: 'all', permissions: [PERMISSIONS.DASHBOARD_MANAGE] }),
    validate(DashboardPermissionUpdateRequest),
  )
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey = req.body.auth;
      const { id, access } = req.body as DashboardPermissionUpdateRequest;
      const result = await this.dashboardPermissionService.update(id, access, auth, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
