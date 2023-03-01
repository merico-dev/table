/**
 * NOTE(Leto)
 * This controller is a temporary solution
 * Will consider storing site settings in db later
 */
import * as express from 'express';
import { controller, httpGet, interfaces } from 'inversify-express-utils';
import { ApiOperationGet, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';

const WebsiteEnvs = {
  WEBSITE_LOGO_URL_ZH: process.env.WEBSITE_LOGO_URL_ZH,
  WEBSITE_LOGO_URL_EN: process.env.WEBSITE_LOGO_URL_EN,
  WEBSITE_LOGO_JUMP_URL: process.env.WEBSITE_LOGO_JUMP_URL,
  WEBSITE_FAVICON_URL: process.env.WEBSITE_FAVICON_URL,
};

@ApiPath({
  path: '/website',
  name: 'Website',
})
@controller('/website')
export class WebsiteController implements interfaces.Controller {
  public static TARGET_NAME = 'Website';

  @ApiOperationGet({
    path: '/get_all',
    description: 'Get all website settings',
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpGet('/get_all')
  public async getAll(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      res.json(WebsiteEnvs);
    } catch (err) {
      next(err);
    }
  }
}
