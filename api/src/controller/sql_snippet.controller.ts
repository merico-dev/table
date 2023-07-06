import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiOperationPut, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { validate } from '../middleware/validation';
import permission from '../middleware/permission';
import { SqlSnippetService } from '../services/sql_snippet.service';
import { SqlSnippetCreateOrUpdateRequest, SqlSnippetIDRequest, SqlSnippetListRequest } from '../api_models/sql_snippet';
import { PERMISSIONS } from '../services/role.service';

@ApiPath({
  path: '/sql_snippet',
  name: 'SqlSnippet',
})
@controller('/sql_snippet')
export class SqlSnippetController implements interfaces.Controller {
  public static TARGET_NAME = 'SqlSnippet';

  @inject('SqlSnippetService')
  private sqlSnippetService: SqlSnippetService;

  @ApiOperationPost({
    path: '/list',
    description: 'List saved sql snippets',
    parameters: {
      body: { description: 'sql snippets list request', required: true, model: 'SqlSnippetListRequest' },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'SqlSnippetPaginationResponse',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/list',
    permission({ match: 'all', permissions: [PERMISSIONS.SQL_SNIPPET_VIEW] }),
    validate(SqlSnippetListRequest),
  )
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { filter, sort, pagination } = req.body as SqlSnippetListRequest;
      const result = await this.sqlSnippetService.list(filter, sort, pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/create',
    description: 'Create a sql snippet',
    parameters: {
      body: {
        description: 'sql snippet create or update request',
        required: true,
        model: 'SqlSnippetCreateOrUpdateRequest',
      },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'SqlSnippet' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/create',
    permission({ match: 'all', permissions: [PERMISSIONS.SQL_SNIPPET_MANAGE] }),
    validate(SqlSnippetCreateOrUpdateRequest),
  )
  public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id, content } = req.body as SqlSnippetCreateOrUpdateRequest;
      const result = await this.sqlSnippetService.create(id, content, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/get',
    description: 'Get a sql snippet',
    parameters: {
      body: {
        description: 'sql snippet get request',
        required: true,
        model: 'SqlSnippetIDRequest',
      },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'SqlSnippet' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/get',
    permission({ match: 'all', permissions: [PERMISSIONS.SQL_SNIPPET_VIEW] }),
    validate(SqlSnippetIDRequest),
  )
  public async get(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id } = req.body as SqlSnippetIDRequest;
      const result = await this.sqlSnippetService.get(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPut({
    path: '/update',
    description: 'Update a sql snippet',
    parameters: {
      body: {
        description: 'sql snippet create or update request',
        required: true,
        model: 'SqlSnippetCreateOrUpdateRequest',
      },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'SqlSnippet' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPut(
    '/update',
    permission({ match: 'all', permissions: [PERMISSIONS.SQL_SNIPPET_MANAGE] }),
    validate(SqlSnippetCreateOrUpdateRequest),
  )
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id, content } = req.body as SqlSnippetCreateOrUpdateRequest;
      const result = await this.sqlSnippetService.update(id, content, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/delete',
    description: 'Delete a sql snippet',
    parameters: {
      body: {
        description: 'sql snippet delete request',
        required: true,
        model: 'SqlSnippetIDRequest',
      },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'SqlSnippetIDRequest',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/delete',
    permission({ match: 'all', permissions: [PERMISSIONS.SQL_SNIPPET_MANAGE] }),
    validate(SqlSnippetIDRequest),
  )
  public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id } = req.body as SqlSnippetIDRequest;
      await this.sqlSnippetService.delete(id, req.locale);
      res.json({ id });
    } catch (err) {
      next(err);
    }
  }
}
