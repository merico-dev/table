import * as express from 'express';
import { inject, interfaces as inverfaces } from 'inversify';
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
  private dashboardService: DashboardService;

  public constructor(@inject('Newable<DashboardService>') DashboardService: inverfaces.Newable<DashboardService>) {
    this.dashboardService = new DashboardService();
  }

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
  @httpPost('/list', permission(ROLE_TYPES.READER))
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { filter, sort, pagination } = validate(DashboardListRequest, req.body);
      const result = await this.dashboardService.list(filter, sort, pagination);
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
  @httpPost('/create', permission(ROLE_TYPES.AUTHOR))
  public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { name, content, group } = validate(DashboardCreateRequest, req.body);
      const result = await this.dashboardService.create(name, content, group, req.locale, req.body.auth);
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
  @httpPost('/details', permission(ROLE_TYPES.READER))
  public async details(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id } = validate(DashboardIDRequest, req.body);
      await DashboardPermissionService.checkPermission(
        id,
        'VIEW',
        req.body.auth?.role_id >= ROLE_TYPES.ADMIN,
        req.locale,
        req.body.auth ? (req.body.auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
        req.body.auth?.id,
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
  @httpPost('/detailsByName', permission(ROLE_TYPES.READER))
  public async detailsByName(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { name, is_preset } = validate(DashboardNameRequest, req.body);
      const result = await this.dashboardService.getByName(name, is_preset);
      await DashboardPermissionService.checkPermission(
        result.id,
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
  @httpPut('/update', permission(ROLE_TYPES.AUTHOR))
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey | null = req.body.auth;
      const { id, name, content, is_removed, group } = validate(DashboardUpdateRequest, req.body);
      await DashboardPermissionService.checkPermission(
        id,
        'EDIT',
        req.body.auth?.role_id >= ROLE_TYPES.ADMIN,
        req.locale,
        req.body.auth ? (req.body.auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
        req.body.auth?.id,
      );
      const result = await this.dashboardService.update(
        id,
        name,
        content,
        is_removed,
        group,
        req.locale,
        auth?.role_id,
      );
      socketEmit(channelBuilder(SERVER_CHANNELS.DASHBOARD, [id]), 'UPDATED');
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
  @httpPost('/delete', permission(ROLE_TYPES.AUTHOR))
  public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey | null = req.body.auth;
      const { id } = validate(DashboardIDRequest, req.body);
      await DashboardPermissionService.checkPermission(
        id,
        'EDIT',
        req.body.auth?.role_id >= ROLE_TYPES.ADMIN,
        req.locale,
        req.body.auth ? (req.body.auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
        req.body.auth?.id,
      );
      const result = await this.dashboardService.delete(id, req.locale, auth?.role_id);
      socketEmit(channelBuilder(SERVER_CHANNELS.DASHBOARD, [id]), 'UPDATED');
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
