import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationGet, ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { ConfigService } from '../services/config.service';
import { validate } from '../middleware/validation';
import { ConfigGetRequest, ConfigUpdateRequest } from '../api_models/config';

@ApiPath({
  path: '/config',
  name: 'Config',
})
@controller('/config')
export class ConfigController implements interfaces.Controller {
  public static TARGET_NAME = 'Config';

  @inject('ConfigService')
  private configService: ConfigService;

  @ApiOperationGet({
    path: '/getDescriptions',
    description: 'Get config descrptions',
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ConfigDescription' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpGet('/getDescriptions')
  public async getDescriptions(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const result = await this.configService.getDescriptions(req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/get',
    description: 'Get config',
    parameters: {
      body: { description: 'Config get request', required: true, model: 'ConfigGetRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Config' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/get', validate(ConfigGetRequest))
  public async get(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { key } = req.body as ConfigGetRequest;
      const result = await this.configService.get(key, req.body.auth);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/update',
    description: 'Update config',
    parameters: {
      body: { description: 'Config update request', required: true, model: 'ConfigUpdateRequest' },
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Config' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost('/update', validate(ConfigUpdateRequest))
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { key, value } = req.body as ConfigUpdateRequest;
      const result = await this.configService.update(key, value, req.body.auth, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
