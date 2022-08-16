import * as express from 'express';
import { inject, interfaces as inverfaces } from 'inversify';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { DataSourceService } from '../services/datasource.service';
import { validate } from '../middleware/validation';
import { DataSourceListRequest, DataSourceCreateRequest, DataSourceIDRequest } from '../api_models/datasource';
import { RoleService } from '../services/role.service';
import Account from '../models/account';
import { ROLE_TYPES } from '../api_models/role';

@ApiPath({
  path: '/datasource',
  name: 'DataSource'
})
@controller('/datasource')
export class DataSourceController implements interfaces.Controller {
  public static TARGET_NAME: string = 'DataSource';
  private dataSourceService: DataSourceService;
  private roleService: RoleService;

  public constructor(
    @inject('Newable<DataSourceService>') DataSourceService: inverfaces.Newable<DataSourceService>,
    @inject('Newable<RoleService>') RoleService: inverfaces.Newable<RoleService>
  ) {
    this.dataSourceService = new DataSourceService();
    this.roleService = new RoleService();
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
      const account: Account = req.body.account;
      this.roleService.checkPermission(account, ROLE_TYPES.READER);
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
      const account: Account = req.body.account;
      this.roleService.checkPermission(account, ROLE_TYPES.ADMIN);
      const { type, key, config } = validate(DataSourceCreateRequest, req.body);
      const result = await this.dataSourceService.create(type, key, config);
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
      const account: Account = req.body.account;
      this.roleService.checkPermission(account, ROLE_TYPES.ADMIN);
      const { id } = validate(DataSourceIDRequest, req.body);
      await this.dataSourceService.delete(id);
      res.json();
    } catch (err) {
      next(err);
    }
  }
}