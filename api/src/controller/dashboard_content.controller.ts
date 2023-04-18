import * as express from 'express';
import { inject, interfaces as inverfaces } from 'inversify';
import { controller, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiOperationPut, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { validate } from '../middleware/validation';
import { ROLE_TYPES } from '../api_models/role';
import permission from '../middleware/permission';
import ApiKey from '../models/apiKey';
import Account from '../models/account';
import { DashboardPermissionService } from '../services/dashboard_permission.service';
import { channelBuilder, SERVER_CHANNELS, socketEmit } from '../utils/websocket';
import {
  DashboardContentCreateRequest,
  DashboardContentIDRequest,
  DashboardContentListRequest,
  DashboardContentUpdateRequest,
} from '../api_models/dashboard_content';
import { DashboardContentService } from '../services/dashboard_content.service';

@ApiPath({
  path: '/dashboard_content',
  name: 'DashboardContent',
})
@controller('/dashboard_content')
export class DashboardContentController implements interfaces.Controller {
  public static TARGET_NAME = 'DashboardContent';
  private dashboardContentService: DashboardContentService;

  public constructor(
    @inject('Newable<DashboardContentService>') DashboardContentService: inverfaces.Newable<DashboardContentService>,
  ) {
    this.dashboardContentService = new DashboardContentService();
  }

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
  @httpPost('/list', permission(ROLE_TYPES.READER), validate(DashboardContentListRequest))
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { dashboard_id, filter, sort, pagination } = req.body as DashboardContentListRequest;
      await DashboardPermissionService.checkPermission(
        dashboard_id,
        'VIEW',
        req.body.auth?.role_id >= ROLE_TYPES.ADMIN,
        req.locale,
        req.body.auth ? (req.body.auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
        req.body.auth?.id,
      );
      const result = await this.dashboardContentService.list(dashboard_id, filter, sort, pagination);
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
  @httpPost('/create', permission(ROLE_TYPES.AUTHOR), validate(DashboardContentCreateRequest))
  public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { dashboard_id, name, content } = req.body as DashboardContentCreateRequest;
      await DashboardPermissionService.checkPermission(
        dashboard_id,
        'EDIT',
        req.body.auth?.role_id >= ROLE_TYPES.ADMIN,
        req.locale,
        req.body.auth ? (req.body.auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
        req.body.auth?.id,
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
  @httpPost('/details', permission(ROLE_TYPES.READER), validate(DashboardContentIDRequest))
  public async details(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id } = req.body as DashboardContentIDRequest;
      const result = await this.dashboardContentService.get(id);
      await DashboardPermissionService.checkPermission(
        result.dashboard_id,
        'VIEW',
        req.body.auth?.role_id >= ROLE_TYPES.ADMIN,
        req.locale,
        req.body.auth ? (req.body.auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
        req.body.auth?.id,
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
  @httpPut('/update', permission(ROLE_TYPES.AUTHOR), validate(DashboardContentUpdateRequest))
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey | null = req.body.auth;
      const { id, name, content } = req.body as DashboardContentUpdateRequest;
      const result = await this.dashboardContentService.update(id, name, content, req.locale, auth);
      socketEmit(channelBuilder(SERVER_CHANNELS.DASHBOARD_CONTENT, [id]), {
        update_time: result.update_time,
        message: 'UPDATED',
        auth_id: auth?.id ?? null,
        auth_type: !auth ? null : auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT',
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
  @httpPost('/delete', permission(ROLE_TYPES.AUTHOR), validate(DashboardContentIDRequest))
  public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey | null = req.body.auth;
      const { id } = req.body as DashboardContentIDRequest;
      await this.dashboardContentService.delete(id, req.locale, auth);
      socketEmit(channelBuilder(SERVER_CHANNELS.DASHBOARD_CONTENT, [id]), {
        update_time: new Date(),
        message: 'DELETED',
        auth_id: auth?.id ?? null,
        auth_type: !auth ? null : auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT',
      });
      res.json({ id });
    } catch (err) {
      next(err);
    }
  }
}
