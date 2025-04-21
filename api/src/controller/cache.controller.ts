import express from 'express';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { CacheClearRequest } from '../api_models/cache';
import { validate } from '../middleware/validation';
import { clearCache, clearCacheByContentId } from '../utils/cache';
@ApiPath({
  path: '/cache',
  name: 'Cache',
})
@controller('/cache')
export class CacheController implements interfaces.Controller {
  public static TARGET_NAME = 'Cache';

  @ApiOperationPost({
    path: '/clear',
    description: 'Clear cache',
    parameters: {},
    responses: {
      200: { description: 'SUCCESS' },
    },
  })
  @httpPost('/clear')
  public async clear(): Promise<void> {
    await clearCache();
  }

  @ApiOperationPost({
    path: '/clear/dashboard',
    description: 'Clear cache by content id',
    parameters: {
      body: { description: 'Cache clear request', required: true, model: 'CacheClearRequest' },
    },
    responses: {
      200: { description: 'SUCCESS' },
    },
  })
  @httpPost('/clear/dashboard', validate(CacheClearRequest))
  public async clearByContentId(req: express.Request): Promise<void> {
    const { content_id } = req.body as CacheClearRequest;
    await clearCacheByContentId(content_id);
  }
}
