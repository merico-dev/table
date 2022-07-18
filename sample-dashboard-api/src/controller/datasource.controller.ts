import * as express from 'express';
import { inject, interfaces as inverfaces } from 'inversify';
import { controller, httpGet, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { ApiOperationGet, ApiOperationPost, ApiOperationPut, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { DataSourceService } from '../services/datasource.service';
import { validate } from '../middleware/validation';
import { DataSourceListRequest, DataSourceCreateRequest, DataSourceUpdateRequest, DataSourceIDRequest } from '../api_models/datasource';

@ApiPath({
  path: '/datasource',
  name: 'DataSource'
})
@controller('/datasource')
export class DataSourceController implements interfaces.Controller {
  public static TARGET_NAME: string = 'DataSource';
  private dataSourceService: DataSourceService;

  public constructor(
    @inject('Newable<DataSourceService>') DataSourceService: inverfaces.Newable<DataSourceService>
  ) {
    this.dataSourceService = new DataSourceService();
  }

  @ApiOperationPost({
    path: '/list',
    description: 'List datasources',
    parameters: {
      body: { description: 'datasource list request', required: true, model: 'DataSourceListRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'DataSourcePaginationResponse' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
    }
  })
  @httpPost('/list')
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { filter, sort, pagination } = validate(DataSourceListRequest, req.body);
      const result = await this.dataSourceService.list(filter, sort, pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/create',
    description: 'Create a new datasource',
    parameters: {
      body: { description: 'new datasource request', required: true, model: 'DataSourceCreateRequest'}
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'DataSource' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
    }
  })
  @httpPost('/create')
  public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { type, key, config } = validate(DataSourceCreateRequest, req.body);
      const result = await this.dataSourceService.create(type, key, config);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationGet({
    path: '/details/{id}',
    description: 'Show datasource',
    parameters: {
      path: { ['id']: { description: 'datasource id' } }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'DataSource' },
      404: { description: 'NOT FOUND', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
    }
  })
  @httpGet('/details/:id')
  public async details(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const id = req.params.id;
      const result = await this.dataSourceService.get(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPut({
    path: '/update',
    description: 'Update datasource',
    parameters: {
      body: { description: 'update datasource request', required: true, model: 'DataSourceUpdateRequest'}
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'DataSource' },
      404: { description: 'NOT FOUND', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
    }
  })
  @httpPut('/update')
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id, type, key, config } = validate(DataSourceUpdateRequest, req.body);
      const result = await this.dataSourceService.update(id, type, key, config);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/delete',
    description: 'Remove datasource',
    parameters: {
      body: { description: 'update datasource request', required: true, model: 'DataSourceIDRequest'}
    },
    responses: {
      200: { description: 'SUCCESS' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
    }
  })
  @httpPost('/delete')
  public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id } = validate(DataSourceIDRequest, req.body);
      await this.dataSourceService.delete(id);
      res.json();
    } catch (err) {
      next(err);
    }
  }
}