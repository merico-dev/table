import * as express from 'express';
import { inject, interfaces as inverfaces } from 'inversify';
import { controller, httpPost, httpPut, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { DashboardChangelogListRequest } from '../api_models/dashboard_changelog';
import { ROLE_TYPES } from '../api_models/role';
import permission from '../middleware/permission';
import { validate } from '../middleware/validation';
import { DashboardChangelogService } from '../services/dashboard_changelog.service';

@ApiPath({
  path: '/dashboard_changelog',
  name: 'DashboardChangelog'
})
@controller('/dashboard_changelog')
export class DashboardChangelogController implements interfaces.Controller {
  public static TARGET_NAME = 'DashboardChangelog';
  private dashboardChangelogService: DashboardChangelogService;

  public constructor(
    @inject('Newable<DashboardChangelogService>') DashboardChangelogService: inverfaces.Newable<DashboardChangelogService>
  ) {
    this.dashboardChangelogService = new DashboardChangelogService();
  }

  @ApiOperationPost({
    path: '/list',
    description: 'List dashboard changelogs',
    parameters: {
      body: { description: 'dashboard changelog list request', required: true, model: 'DashboardChangelogListRequest' }
    },
    responses: {
      200: { description: 'SUCCESS', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'DashboardChangelogPaginationResponse' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError'},
    }
  })
  @httpPost('/list', permission(ROLE_TYPES.READER))
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { filter, sort, pagination } = validate(DashboardChangelogListRequest, req.body);
      const result = await this.dashboardChangelogService.list(filter, sort, pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}