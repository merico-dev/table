import * as express from 'express';
import { inject, interfaces as inversaces } from 'inversify';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { QueryService } from '../services/query.service';
import { validate } from '../middleware/validation';
import { QueryRequest } from '../api_models/query';
import { RoleService } from '../services/role.service';
import Account from '../models/account';
import { ROLE_TYPES } from '../api_models/role';

@ApiPath({
  path: '/query',
  name: 'Query'
})
@controller('/query')
export class QueryController implements interfaces.Controller {
  public static TARGET_NAME = 'Query';
  private queryService: QueryService;
  private roleService: RoleService;

  public constructor(
    @inject('Newable<QueryService>') QueryService: inversaces.Newable<QueryService>,
    @inject('Newable<RoleService>') RoleService: inversaces.Newable<RoleService>
  ) {
    this.queryService = new QueryService();
    this.roleService = new RoleService();
  }

  @ApiOperationPost({
    path: '/',
    description: 'Execute query against selected datasource',
    parameters: {
      body: { description: 'Query object', required: true, model: 'QueryRequest' }
    },
    responses: {
      200: { description: 'Query result' },
      500: { description: 'ApiError', model: 'ApiError' },
    }
  })
  @httpPost('/')
  public async query(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const account: Account = req.body.account;
      this.roleService.checkPermission(account, ROLE_TYPES.READER);
      const { type, key, query } = validate(QueryRequest, req.body);
      const result = await this.queryService.query(type, key, query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}