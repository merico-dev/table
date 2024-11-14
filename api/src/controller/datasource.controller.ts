import * as express from 'express';
import _, { has } from 'lodash';
import { inject } from 'inversify';
import { controller, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiOperationPut, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { DataSourceService } from '../services/datasource.service';
import { validate } from '../middleware/validation';
import {
  DataSourceListRequest,
  DataSourceCreateRequest,
  DataSourceIDRequest,
  DataSourceConfig,
  DataSourceRenameRequest,
  DataSourceUpdateRequest,
} from '../api_models/datasource';
import ApiKey from '../models/apiKey';
import Account from '../models/account';
import { ApiError, BAD_REQUEST } from '../utils/errors';
import permission from '../middleware/permission';
import { translate } from '../utils/i18n';
import { PERMISSIONS } from '../services/role.service';

@ApiPath({
  path: '/datasource',
  name: 'DataSource',
})
@controller('/datasource')
export class DataSourceController implements interfaces.Controller {
  public static TARGET_NAME = 'DataSource';

  @inject('DataSourceService')
  private dataSourceService: DataSourceService;

  @ApiOperationPost({
    path: '/list',
    description: 'List datasources',
    parameters: {
      body: { description: 'datasource list request', required: true, model: 'DataSourceListRequest' },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'DataSourcePaginationResponse',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/list',
    permission({ match: 'all', permissions: [PERMISSIONS.DATASOURCE_VIEW] }),
    validate(DataSourceListRequest),
  )
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { filter, sort, pagination } = req.body as DataSourceListRequest;
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
      body: { description: 'new datasource request', required: true, model: 'DataSourceCreateRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'DataSource' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/create',
    permission({ match: 'all', permissions: [PERMISSIONS.DATASOURCE_MANAGE] }),
    validate(DataSourceCreateRequest),
  )
  public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { type, key, config } = req.body as DataSourceCreateRequest;
      this.validateConfig(type, config, req.locale);
      const result = await this.dataSourceService.create(type, key, config, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPut({
    path: '/rename',
    description: 'rename datasource',
    parameters: {
      body: { description: 'datasource rename request', required: true, model: 'DataSourceRenameRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Job' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPut(
    '/rename',
    permission({ match: 'all', permissions: [PERMISSIONS.DATASOURCE_MANAGE] }),
    validate(DataSourceRenameRequest),
  )
  public async rename(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey | null = req.body.auth;
      const { id, key } = req.body as DataSourceRenameRequest;
      let auth_id: string | undefined;
      let auth_type: 'APIKEY' | 'ACCOUNT' | undefined;
      if (auth) {
        auth_id = auth.id;
        auth_type = has(auth, 'app_id') ? 'APIKEY' : 'ACCOUNT';
      }
      const result = await this.dataSourceService.rename(id, key, req.locale, auth_id ?? null, auth_type ?? null);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPut({
    path: '/update',
    description: 'update datasource',
    parameters: {
      body: { description: 'datasource update request', required: true, model: 'DataSourceUpdateRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'DataSource' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPut(
    '/update',
    permission({ match: 'all', permissions: [PERMISSIONS.DATASOURCE_MANAGE] }),
    validate(DataSourceUpdateRequest),
  )
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id, config } = req.body as DataSourceUpdateRequest;
      const result = await this.dataSourceService.update(id, config, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/delete',
    description: 'Remove datasource',
    parameters: {
      body: { description: 'datasource ID request', required: true, model: 'DataSourceIDRequest' },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'DataSourceIDRequest',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/delete',
    permission({ match: 'all', permissions: [PERMISSIONS.DATASOURCE_MANAGE] }),
    validate(DataSourceIDRequest),
  )
  public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id } = req.body as DataSourceIDRequest;
      await this.dataSourceService.delete(id, req.locale);
      res.json({ id });
    } catch (err) {
      next(err);
    }
  }

  private validateConfig(
    type: 'mysql' | 'postgresql' | 'http' | 'transform' | 'merico_metric_system',
    config: DataSourceConfig,
    locale: string,
  ): void {
    switch (type) {
      case 'http':
        if (!_.has(config, 'processing') || !_.has(config, 'processing.pre') || !_.has(config, 'processing.post'))
          throw new ApiError(BAD_REQUEST, { message: translate('DATASOURCE_HTTP_REQUIRED_FIELDS', locale) });
        break;

      default:
        if (
          !_.has(config, 'port') ||
          !_.has(config, 'username') ||
          !_.has(config, 'password') ||
          !_.has(config, 'database')
        )
          throw new ApiError(BAD_REQUEST, { message: translate('DATASOURCE_DB_REQUIRED_FIELDS', locale) });
        break;
    }
  }
}
