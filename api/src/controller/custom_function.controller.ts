import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiOperationPut, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { validate } from '../middleware/validation';
import { ROLE_TYPES } from '../api_models/role';
import permission from '../middleware/permission';
import { CustomFunctionService } from '../services/custom_function.service';
import {
  CustomFunctionCreateOrUpdateRequest,
  CustomFunctionIDRequest,
  CustomFunctionListRequest,
} from '../api_models/custom_function';

@ApiPath({
  path: '/custom_function',
  name: 'CustomFunction',
})
@controller('/custom_function')
export class CustomFunctionController implements interfaces.Controller {
  public static TARGET_NAME = 'CustomFunction';

  @inject('CustomFunctionService')
  private customFunctionService: CustomFunctionService;

  @ApiOperationPost({
    path: '/list',
    description: 'List saved custom functions',
    parameters: {
      body: { description: 'custom function list request', required: true, model: 'CustomFunctionListRequest' },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'CustomFunctionPaginationResponse',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/list', permission(ROLE_TYPES.READER), validate(CustomFunctionListRequest))
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { filter, sort, pagination } = req.body as CustomFunctionListRequest;
      const result = await this.customFunctionService.list(filter, sort, pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/create',
    description: 'Create a custom function',
    parameters: {
      body: {
        description: 'custom function create or update request',
        required: true,
        model: 'CustomFunctionCreateOrUpdateRequest',
      },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'CustomFunction' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/create', permission(ROLE_TYPES.ADMIN), validate(CustomFunctionCreateOrUpdateRequest))
  public async create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id, definition } = req.body as CustomFunctionCreateOrUpdateRequest;
      const result = await this.customFunctionService.create(id, definition, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/get',
    description: 'Get a custom function',
    parameters: {
      body: {
        description: 'custom function get request',
        required: true,
        model: 'CustomFunctionIDRequest',
      },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'CustomFunction' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/get', permission(ROLE_TYPES.READER), validate(CustomFunctionIDRequest))
  public async get(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id } = req.body as CustomFunctionIDRequest;
      const result = await this.customFunctionService.get(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPut({
    path: '/update',
    description: 'Update a custom function',
    parameters: {
      body: {
        description: 'custom function create or update request',
        required: true,
        model: 'CustomFunctionCreateOrUpdateRequest',
      },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'CustomFunction' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPut('/update', permission(ROLE_TYPES.ADMIN), validate(CustomFunctionCreateOrUpdateRequest))
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id, definition } = req.body as CustomFunctionCreateOrUpdateRequest;
      const result = await this.customFunctionService.update(id, definition, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/delete',
    description: 'Delete a custom function',
    parameters: {
      body: {
        description: 'custom function delete request',
        required: true,
        model: 'CustomFunctionIDRequest',
      },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'CustomFunctionIDRequest',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/delete', permission(ROLE_TYPES.ADMIN), validate(CustomFunctionIDRequest))
  public async delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { id } = req.body as CustomFunctionIDRequest;
      await this.customFunctionService.delete(id, req.locale);
      res.json({ id });
    } catch (err) {
      next(err);
    }
  }
}
