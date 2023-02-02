import * as express from 'express';
import { inject, interfaces as inverfaces } from 'inversify';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { ConfigService } from '../services/config.service';
import { validate } from '../middleware/validation';
import { ConfigGetRequest, ConfigUpdateRequest } from '../api_models/config';

@ApiPath({
  path: '/config',
  name: 'Config'
})
@controller('/config')
export class ConfigController implements interfaces.Controller {
  public static TARGET_NAME = 'Config';
  private configService: ConfigService;

  public constructor(
    @inject('Newable<ConfigService>') ConfigService: inverfaces.Newable<ConfigService>
  ) {
    this.configService = new ConfigService();
  }

  @ApiOperationPost({
    path: '/get',
    description: 'Get config',
    parameters: {
      body: { description: 'Config get request', required: true, model: 'ConfigGetRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Config' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    }
  })
  @httpPost('/get')
  public async get(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { key } = validate(ConfigGetRequest, req.body);
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
      body: { description: 'Config update request', required: true, model: 'ConfigUpdateRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'Config' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    }
  })
  @httpPost('/update')
  public async update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { key, value } = validate(ConfigUpdateRequest, req.body);
      const result = await this.configService.update(key, value, req.body.auth, req.locale);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}