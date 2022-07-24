import * as express from 'express';
import { inject, interfaces as inverfaces } from 'inversify';
import { controller, httpGet, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { ApiOperationGet, ApiOperationPost, ApiOperationPut, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { DashboardService } from '../services/dashboard.service';
import { validate } from '../middleware/validation';
import { DashboardListRequest, DashboardCreateRequest, DashboardUpdateRequest, DashboardIDRequest } from '../api_models/dashboard';

@ApiPath({
  path: '/dashboard',
  name: 'Dashboard'
})
@controller('/dashboard')
export class DashboardController implements interfaces.Controller {
  public static TARGET_NAME: string = 'Dashboard';
  private dashboardService: DashboardService;

  public constructor(
    @inject('Newable<DashboardService>') DashboardService: inverfaces.Newable<DashboardService>
  ) {
    this.dashboardService = new DashboardService();
  }

  @ApiOperationPost({
    path: '/list',
    description: 'List saved dashboards',
    parameters: {
      body: { description: 'dashboard list request', required: true, model: 'DashboardListRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'DashboardPaginationResponse' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
    }
  })
  @httpPost('/list')
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
      body: { description: 'new dashboard request', required: true, model: 'DashboardCreateRequest'}
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Dashboard' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
    }
  })
  @httpPost('/create')
  public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { name, content } = validate(DashboardCreateRequest, req.body);
      const result = await this.dashboardService.create(name, content);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationGet({
    path: '/details/{id}',
    description: 'Show dashboard',
    parameters: {
      path: { ['id']: { description: 'dashboard id' } }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Dashboard' },
      404: { description: 'NOT FOUND', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
    }
  })
  @httpGet('/details/:id')
  public async details(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const result = await this.dashboardService.get(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPut({
    path: '/update',
    description: 'Update dashboard',
    parameters: {
      body: { description: 'update dashboard request', required: true, model: 'DashboardUpdateRequest'}
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Dashboard' },
      404: { description: 'NOT FOUND', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
    }
  })
  @httpPut('/update')
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id, name, content, is_removed } = validate(DashboardUpdateRequest, req.body);
      const result = await this.dashboardService.update(id, name, content, is_removed);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/delete',
    description: 'Remove dashboard',
    parameters: {
      body: { description: 'update dashboard request', required: true, model: 'DashboardIDRequest'}
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Dashboard' },
      404: { description: 'NOT FOUND', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
    }
  })
  @httpPost('/delete')
  public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id } = validate(DashboardIDRequest, req.body);
      const result = await this.dashboardService.delete(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}