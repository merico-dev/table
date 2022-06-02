import * as express from 'express';
import { inject, interfaces as inversaces } from 'inversify';
import { controller, httpGet, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationGet, ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { QueryService } from '../services/query.service';

@ApiPath({
  path: '/query',
  name: 'Query'
})
@controller('/query')
export class QueryController implements interfaces.Controller {
  public static TARGET_NAME: string = 'Query';
  private queryService: QueryService;

  public constructor(
    @inject('Newable<QueryService>') QueryService: inversaces.Newable<QueryService>
  ) {
    this.queryService = new QueryService();
  }

  @ApiOperationGet({
    path: '/sources',
    description: 'Retrieve all available datasources',
    responses: {
      200: { description: 'Success', type: SwaggerDefinitionConstant.Response.Type.OBJECT }
    }
  })
  @httpGet('/sources')
  public async sources(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const result = await this.queryService.listSources();
      res.json(result);
    } catch (error) {
      next(error)
    }
  }

  @ApiOperationPost({
    path: '/',
    description: 'Execute query against selected datasource',
    parameters: {
      body: { description: 'Query object', required: true, model: 'QueryRequest' }
    },
    responses: {
      200: { description: 'Query result', type: SwaggerDefinitionConstant.Response.Type.ARRAY },
      500: { description: 'ApiError', model: 'ApiError' },
    }
  })
  @httpPost('/')
  public async query(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { type, key, sql } = req.body;
      const result = await this.queryService.query(type, key, sql);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}