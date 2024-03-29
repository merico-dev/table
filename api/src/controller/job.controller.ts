import * as express from 'express';
import { inject } from 'inversify';
import { controller, httpPost, interfaces } from 'inversify-express-utils';
import { ApiOperationPost, ApiPath, SwaggerDefinitionConstant } from 'swagger-express-ts';
import { JobListRequest, JobRunRequest } from '../api_models/job';
import permission from '../middleware/permission';
import { validate } from '../middleware/validation';
import { JobService } from '../services/job.service';
import { PERMISSIONS } from '../services/role.service';

@ApiPath({
  path: '/job',
  name: 'Job',
})
@controller('/job')
export class JobController implements interfaces.Controller {
  public static TARGET_NAME = 'Job';

  @inject('JobService')
  private jobService: JobService;

  @ApiOperationPost({
    path: '/list',
    description: 'List of jobs',
    parameters: {
      body: { description: 'job list request', required: true, model: 'JobListRequest' },
    },
    responses: {
      200: {
        description: 'SUCCESS',
        type: SwaggerDefinitionConstant.Response.Type.OBJECT,
        model: 'JobPaginationResponse',
      },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/list',
    permission({ match: 'any', permissions: [PERMISSIONS.DATASOURCE_MANAGE, PERMISSIONS.DASHBOARD_MANAGE] }),
    validate(JobListRequest),
  )
  public async list(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { filter, sort, pagination } = req.body as JobListRequest;
      const result = await this.jobService.list(filter, sort, pagination);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiOperationPost({
    path: '/run',
    description: 'Run jobs',
    parameters: {
      body: { description: 'job run request', required: true, model: 'JobRunRequest' },
    },
    responses: {
      200: { description: 'SUCCESS' },
      500: { description: 'SERVER ERROR', type: SwaggerDefinitionConstant.Response.Type.OBJECT, model: 'ApiError' },
    },
  })
  @httpPost(
    '/run',
    permission({ match: 'any', permissions: [PERMISSIONS.DATASOURCE_MANAGE, PERMISSIONS.DASHBOARD_MANAGE] }),
    validate(JobRunRequest),
  )
  public async run(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    try {
      const { type } = req.body as JobRunRequest;
      const functionMapper = {
        RENAME_DATASOURCE: JobService.processDataSourceRename,
        FIX_DASHBOARD_PERMISSION: JobService.processFixDashboardPermission,
      };
      functionMapper[type]();
      res.json();
    } catch (err) {
      next(err);
    }
  }
}
