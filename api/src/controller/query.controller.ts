import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { QueryService } from '../services/query.service';
import { validate } from '../middleware/validation';
import { QueryRequest, QueryStructureRequest } from '../api_models/query';
import permission from '../middleware/permission';
import { PERMISSIONS } from '../services/role.service';
import { ApiKey } from '../api_models/api';
import { Account } from '../api_models/account';
import { decode } from 'js-base64';

@ApiPath({
  path: '/query',
  name: 'Query',
})
@controller('/query')
export class QueryController implements interfaces.Controller {
  public static TARGET_NAME = 'Query';

  @inject('QueryService')
  private queryService: QueryService;

  @ApiOperationPost({
    path: '/',
    description: 'Execute query against selected datasource',
    parameters: {
      body: { description: 'Query object', required: true, model: 'QueryRequest' },
    },
    responses: {
      200: { description: 'Query result' },
      500: { description: 'ApiError', model: 'ApiError' },
    },
  })
  @httpPost('/', permission({ match: 'all', permissions: [PERMISSIONS.DASHBOARD_VIEW] }), validate(QueryRequest))
  public async query(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey | undefined = req.body.auth;
      const { type, key, query, content_id, query_id, params, env, refresh_cache } = req.body as QueryRequest;
      const result = await this.queryService.query(
        type,
        key,
        decode(query),
        content_id,
        query_id,
        params,
        env || {},
        refresh_cache,
        req.locale,
        auth,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  @ApiOperationPost({
    path: '/structure',
    description: 'query structure of selected datasource',
    parameters: {
      body: { description: 'Query Structure object', required: true, model: 'QueryStructureRequest' },
    },
    responses: {
      200: { description: 'Query result' },
      500: { description: 'ApiError', model: 'ApiError' },
    },
  })
  @httpPost(
    '/structure',
    permission({ match: 'all', permissions: [PERMISSIONS.DASHBOARD_MANAGE] }),
    validate(QueryStructureRequest),
  )
  public async queryStructure(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { query_type, type, key, table_schema, table_name, limit, offset } = req.body as QueryStructureRequest;
      const result = await this.queryService.queryStructure(
        query_type,
        type,
        key,
        table_schema,
        table_name,
        limit,
        offset,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
