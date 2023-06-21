import * as express from 'express';
import { inject, interfaces as inversaces } from 'inversify';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { QueryService } from '../services/query.service';
import { validate } from '../middleware/validation';
import { QueryRequest } from '../api_models/query';
import { ROLE_TYPES } from '../api_models/role';
import permission from '../middleware/permission';
import Account from '../models/account';
import ApiKey from '../models/apiKey';

@ApiPath({
  path: '/query',
  name: 'Query',
})
@controller('/query')
export class QueryController implements interfaces.Controller {
  public static TARGET_NAME = 'Query';
  private queryService: QueryService;

  public constructor(@inject('Newable<QueryService>') QueryService: inversaces.Newable<QueryService>) {
    this.queryService = new QueryService();
  }

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
  @httpPost('/', permission(ROLE_TYPES.READER), validate(QueryRequest))
  public async query(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const auth: Account | ApiKey | null = req.body.auth;
      const { content_id, query_id, params, env, refresh_cache } = req.body as QueryRequest;
      const result = await this.queryService.query(
        content_id,
        query_id,
        params,
        env || {},
        refresh_cache,
        auth,
        req.locale,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
