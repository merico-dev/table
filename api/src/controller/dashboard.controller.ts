import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiOperationPut, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { DashboardService } from '../services/dashboard.service';
import { validate } from '../middleware/validation';
import {
  DashboardListRequest,
  DashboardCreateRequest,
  DashboardUpdateRequest,
  DashboardIDRequest,
  DashboardNameRequest,
} from '../api_models/dashboard';
import { ROLE_TYPES } from '../api_models/role';
import permission from '../middleware/permission';
import ApiKey from '../models/apiKey';
import Account from '../models/account';
import { DashboardPermissionService } from '../services/dashboard_permission.service';
import { channelBuilder, SERVER_CHANNELS, socketEmit } from '../utils/websocket';

@ApiPath({
  path: '/dashboard',
  name: 'Dashboard',
})
@controller('/dashboard')
export class DashboardController implements interfaces.Controller {
  public static TARGET_NAME = 'Dashboard';

  @inject('DashboardService')
  private dashboardService: DashboardService;

  @ApiOperationPost({
    path: '/list',
    description: 'List saved dashboards',
    parameters: {
      body: { description: 'dashboard list request', required: true, model: 'DashboardListRequest' },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'DashboardPaginationResponse',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/list', permission(ROLE_TYPES.READER), validate(DashboardListRequest))
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { filter, sort, pagination } = req.body as DashboardListRequest;
      const result = await this.dashboardService.list(filter, sort, pagination, req.body.auth);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/create',
    description: 'Create a new dashboard',
    parameters: {
      body: { description: 'new dashboard request', required: true, model: 'DashboardCreateRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Dashboard' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/create', permission(ROLE_TYPES.AUTHOR), validate(DashboardCreateRequest))
  public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { name, group } = req.body as DashboardCreateRequest;
      const result = await this.dashboardService.create(name, group, req.locale, req.body.auth);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/details',
    description: 'Show dashboard',
    parameters: {
      body: { description: 'get dashboard request', required: true, model: 'DashboardIDRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Dashboard' },
      404: { description: 'NOT FOUND', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/details', permission(ROLE_TYPES.READER), validate(DashboardIDRequest))
  public async details(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id } = req.body as DashboardIDRequest;
      await DashboardPermissionService.checkPermission(
        id,
        'VIEW',
        req.locale,
        req.body.auth?.id,
        req.body.auth ? (req.body.auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
        req.body.auth?.role_id,
      );
      const result = await this.dashboardService.get(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/detailsByName',
    description: 'Show dashboard',
    parameters: {
      body: { description: 'get dashboard by name request', required: true, model: 'DashboardNameRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Dashboard' },
      404: { description: 'NOT FOUND', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/detailsByName', permission(ROLE_TYPES.READER), validate(DashboardNameRequest))
  public async detailsByName(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { name, is_preset } = req.body as DashboardNameRequest;
      const result = await this.dashboardService.getByName(name, is_preset);
      await DashboardPermissionService.checkPermission(
        result.id,
        'VIEW',
        req.locale,
        req.body.auth?.id,
        req.body.auth ? (req.body.auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
        req.body.auth?.role_id,
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPut({
    path: '/update',
    description: 'Update dashboard',
    parameters: {
      body: { description: 'update dashboard request', required: true, model: 'DashboardUpdateRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Dashboard' },
      404: { description: 'NOT FOUND', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPut('/update', permission(ROLE_TYPES.AUTHOR), validate(DashboardUpdateRequest))
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey | null = req.body.auth;
      const { id, name, content_id, is_removed, group } = req.body as DashboardUpdateRequest;
      await DashboardPermissionService.checkPermission(
        id,
        'EDIT',
        req.locale,
        req.body.auth?.id,
        req.body.auth ? (req.body.auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
        req.body.auth?.role_id,
      );
      const result = await this.dashboardService.update(
        id,
        name,
        content_id,
        is_removed,
        group,
        req.locale,
        auth?.role_id,
      );
      socketEmit(channelBuilder(SERVER_CHANNELS.DASHBOARD, [id]), {
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
    description: 'Remove dashboard',
    parameters: {
      body: { description: 'delete dashboard request', required: true, model: 'DashboardIDRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Dashboard' },
      404: { description: 'NOT FOUND', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/delete', permission(ROLE_TYPES.AUTHOR), validate(DashboardIDRequest))
  public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey | null = req.body.auth;
      const { id } = req.body as DashboardIDRequest;
      await DashboardPermissionService.checkPermission(
        id,
        'EDIT',
        req.locale,
        req.body.auth?.id,
        req.body.auth ? (req.body.auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
        req.body.auth?.role_id,
      );
      const result = await this.dashboardService.delete(id, req.locale, auth?.role_id);
      socketEmit(channelBuilder(SERVER_CHANNELS.DASHBOARD, [id]), {
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
}
