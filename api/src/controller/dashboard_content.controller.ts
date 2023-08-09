import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiOperationPut, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { validate } from '../middleware/validation';
import permission from '../middleware/permission';
import { ApiKey } from '../api_models/api';
import { Account } from '../api_models/account';
import { DashboardPermissionService } from '../services/dashboard_permission.service';
import { channelBuilder, SERVER_CHANNELS, socketEmit } from '../utils/websocket';
import {
  DashboardContentCreateRequest,
  DashboardContentIDRequest,
  DashboardContentListRequest,
  DashboardContentUpdateRequest,
} from '../api_models/dashboard_content';
import { DashboardContentService } from '../services/dashboard_content.service';
import { PERMISSIONS } from '../services/role.service';
import { has } from 'lodash';

@ApiPath({
  path: '/dashboard_content',
  name: 'DashboardContent',
})
@controller('/dashboard_content')
export class DashboardContentController implements interfaces.Controller {
  public static TARGET_NAME = 'DashboardContent';

  @inject('DashboardContentService')
  private dashboardContentService: DashboardContentService;

  @ApiOperationPost({
    path: '/list',
    description: 'List saved dashboard content',
    parameters: {
      body: { description: 'dashboard content list request', required: true, model: 'DashboardContentListRequest' },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'DashboardContentPaginationResponse',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/list',
    permission({ match: 'all', permissions: [PERMISSIONS.DASHBOARD_VIEW] }),
    validate(DashboardContentListRequest),
  )
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey | undefined = req.body.auth;
      const { dashboard_id, filter, sort, pagination } = req.body as DashboardContentListRequest;
      let auth_id: string | undefined;
      let auth_type: 'APIKEY' | 'ACCOUNT' | undefined;
      let auth_role_id: string | undefined;
      let auth_permissions: string[] | undefined;
      if (auth) {
        auth_id = auth.id;
        auth_type = has(auth, 'app_id') ? 'APIKEY' : 'ACCOUNT';
        auth_role_id = auth.role_id;
        auth_permissions = auth.permissions;
      }
      await DashboardPermissionService.checkPermission(
        dashboard_id,
        'VIEW',
        req.locale,
        auth_id,
        auth_type,
        auth_role_id,
        auth_permissions,
      );
      const result = await this.dashboardContentService.list(dashboard_id, filter, sort, pagination, auth);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/create',
    description: 'Create a new dashboard content',
    parameters: {
      body: { description: 'new dashboard content request', required: true, model: 'DashboardContentCreateRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'DashboardContent' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/create',
    permission({ match: 'all', permissions: [PERMISSIONS.DASHBOARD_MANAGE] }),
    validate(DashboardContentCreateRequest),
  )
  public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey | undefined = req.body.auth;
      const { dashboard_id, name, content } = req.body as DashboardContentCreateRequest;
      let auth_id: string | undefined;
      let auth_type: 'APIKEY' | 'ACCOUNT' | undefined;
      let auth_role_id: string | undefined;
      let auth_permissions: string[] | undefined;
      if (auth) {
        auth_id = auth.id;
        auth_type = has(auth, 'app_id') ? 'APIKEY' : 'ACCOUNT';
        auth_role_id = auth.role_id;
        auth_permissions = auth.permissions;
      }
      await DashboardPermissionService.checkPermission(
        dashboard_id,
        'EDIT',
        req.locale,
        auth_id,
        auth_type,
        auth_role_id,
        auth_permissions,
      );
      const result = await this.dashboardContentService.create(dashboard_id, name, content, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/details',
    description: 'Show dashboard content',
    parameters: {
      body: { description: 'get dashboard content request', required: true, model: 'DashboardContentIDRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'DashboardContent' },
      404: { description: 'NOT FOUND', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/details',
    permission({ match: 'all', permissions: [PERMISSIONS.DASHBOARD_VIEW] }),
    validate(DashboardContentIDRequest),
  )
  public async details(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey | undefined = req.body.auth;
      const { id } = req.body as DashboardContentIDRequest;
      const result = await this.dashboardContentService.get(id);
      let auth_id: string | undefined;
      let auth_type: 'APIKEY' | 'ACCOUNT' | undefined;
      let auth_role_id: string | undefined;
      let auth_permissions: string[] | undefined;
      if (auth) {
        auth_id = auth.id;
        auth_type = has(auth, 'app_id') ? 'APIKEY' : 'ACCOUNT';
        auth_role_id = auth.role_id;
        auth_permissions = auth.permissions;
      }
      await DashboardPermissionService.checkPermission(
        result.dashboard_id,
        'VIEW',
        req.locale,
        auth_id,
        auth_type,
        auth_role_id,
        auth_permissions,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPut({
    path: '/update',
    description: 'Update dashboard content',
    parameters: {
      body: { description: 'update dashboard content request', required: true, model: 'DashboardContentUpdateRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'DashboardContent' },
      404: { description: 'NOT FOUND', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPut(
    '/update',
    permission({ match: 'all', permissions: [PERMISSIONS.DASHBOARD_MANAGE] }),
    validate(DashboardContentUpdateRequest),
  )
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey | undefined = req.body.auth;
      const { id, name, content } = req.body as DashboardContentUpdateRequest;
      const result = await this.dashboardContentService.update(id, name, content, req.locale, auth);
      let auth_id: string | null = null;
      let auth_type: 'APIKEY' | 'ACCOUNT' | null = null;
      if (auth) {
        auth_id = auth.id;
        auth_type = has(auth, 'app_id') ? 'APIKEY' : 'ACCOUNT';
      }
      socketEmit(channelBuilder(SERVER_CHANNELS.DASHBOARD_CONTENT, [id]), {
        update_time: result.update_time,
        message: 'UPDATED',
        auth_id,
        auth_type,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/delete',
    description: 'Remove dashboard content',
    parameters: {
      body: { description: 'delete dashboard content request', required: true, model: 'DashboardContentIDRequest' },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'DashboardContentIDRequest',
      },
      404: { description: 'NOT FOUND', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/delete',
    permission({ match: 'all', permissions: [PERMISSIONS.DASHBOARD_MANAGE] }),
    validate(DashboardContentIDRequest),
  )
  public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey | undefined = req.body.auth;
      const { id } = req.body as DashboardContentIDRequest;
      await this.dashboardContentService.delete(id, req.locale, auth);
      let auth_id: string | null = null;
      let auth_type: 'APIKEY' | 'ACCOUNT' | null = null;
      if (auth) {
        auth_id = auth.id;
        auth_type = has(auth, 'app_id') ? 'APIKEY' : 'ACCOUNT';
      }
      socketEmit(channelBuilder(SERVER_CHANNELS.DASHBOARD_CONTENT, [id]), {
        update_time: new Date(),
        message: 'DELETED',
        auth_id,
        auth_type,
      });
      res.json({ id });
    } catch (err) {
      next(err);
    }
  }
}
