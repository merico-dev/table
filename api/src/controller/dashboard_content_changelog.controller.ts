import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { DashboardContentChangelogListRequest } from '../api_models/dashboard_content_changelog';
import permission from '../middleware/permission';
import { validate } from '../middleware/validation';
import { DashboardContentChangelogService } from '../services/dashboard_content_changelog.service';
import { PERMISSIONS } from '../services/role.service';

@ApiPath({
  path: '/dashboard_content_changelog',
  name: 'DashboardContentChangelog',
})
@controller('/dashboard_content_changelog')
export class DashboardContentChangelogController implements interfaces.Controller {
  public static TARGET_NAME = 'DashboardContentChangelog';

  @inject('DashboardContentChangelogService')
  private dashboardContentChangelogService: DashboardContentChangelogService;

  @ApiOperationPost({
    path: '/list',
    description: 'List dashboard content changelogs',
    parameters: {
      body: {
        description: 'dashboard content changelog list request',
        required: true,
        model: 'DashboardContentChangelogListRequest',
      },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'DashboardContentChangelogPaginationResponse',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/list',
    permission({ match: 'all', permissions: [PERMISSIONS.DASHBOARD_MANAGE] }),
    validate(DashboardContentChangelogListRequest),
  )
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { filter, sort, pagination } = req.body as DashboardContentChangelogListRequest;
      const result = await this.dashboardContentChangelogService.list(filter, sort, pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
