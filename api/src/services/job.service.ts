import _ from 'lodash';
import { PaginationRequest } from '../api_models/base';
import { JobFilterObject, JobPaginationResponse, JobSortObject } from '../api_models/job';
import { dashboardDataSource } from '../data_sources/dashboard';
import Dashboard from '../models/dashboard';
import DashboardChangelog from '../models/dashboard_changelog';
import DashboardPermission from '../models/dashboard_permission';
import DataSource from '../models/datasource';
import Job from '../models/job';
import { escapeLikePattern } from '../utils/helpers';
import { DashboardChangelogService } from './dashboard_changelog.service';
import { QueryService } from './query.service';

enum JobType {
  RENAME_DATASOURCE = 'RENAME_DATASOURCE',
  FIX_DASHBOARD_PERMISSION = 'FIX_DASHBOARD_PERMISSION',
}

enum JobStatus {
  INIT = 'INIT',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

export type RenameJobParams = {
  type: string;
  old_key: string;
  new_key: string;
};

export type FixDashboardPermissionJobParams = {
  auth_id: string;
  auth_type: 'ACCOUNT' | 'APIKEY';
};

export class JobService {
  static processingRenameDataSource = false;
  static processingFixDashboardPermission = false;

  static async addRenameDataSourceJob(params: RenameJobParams): Promise<Job> {
    const jobRepo = dashboardDataSource.getRepository(Job);
    const job = new Job();
    job.type = JobType.RENAME_DATASOURCE;
    job.status = JobStatus.INIT;
    job.params = params;
    const result = await jobRepo.save(job);
    this.processDataSourceRename();
    return result;
  }

  static async addFixDashboardPermissionJob(params: FixDashboardPermissionJobParams): Promise<Job> {
    const jobRepo = dashboardDataSource.getRepository(Job);
    const job = new Job();
    job.type = JobType.FIX_DASHBOARD_PERMISSION;
    job.status = JobStatus.INIT;
    job.params = params;
    const result = await jobRepo.save(job);
    this.processFixDashboardPermission();
    return result;
  }

  static async processDataSourceRename(): Promise<void> {
    if (this.processingRenameDataSource) {
      return;
    }
    this.processingRenameDataSource = true;

    const runner = dashboardDataSource.createQueryRunner();
    await runner.connect();

    const dashboardChangelogRepo = runner.manager.getRepository(DashboardChangelog);
    const datasourceRepo = runner.manager.getRepository(DataSource);
    const dashboardRepo = runner.manager.getRepository(Dashboard);
    const jobRepo = runner.manager.getRepository(Job);

    let jobs = await jobRepo
      .createQueryBuilder('job')
      .where('type = :type', { type: JobType.RENAME_DATASOURCE })
      .andWhere('status = :status', { status: JobStatus.INIT })
      .orderBy('create_time', 'ASC')
      .getMany();

    while (jobs.length) {
      for (const job of jobs) {
        await runner.startTransaction();
        try {
          const params = job.params as RenameJobParams;

          await QueryService.removeDBConnection(params.type, params.old_key);

          const datasource = await datasourceRepo.findOneByOrFail({ type: params.type, key: params.old_key });
          datasource.key = params.new_key;
          await datasourceRepo.save(datasource);

          const result: { affected_dashboards: { dashboardId: string; queries: string[] }[] } = {
            affected_dashboards: [],
          };

          const dashboards = await runner.manager
            .createQueryBuilder()
            .from(Dashboard, 'dashboard')
            .where(`content @> '{"definition":{"queries":[{"type": "${params.type}", "key": "${params.old_key}"}]}}' `)
            .getRawMany<Dashboard>();

          for (const dashboard of dashboards) {
            let updated = false;
            const originalDashboard = _.cloneDeep(dashboard);
            const queries: string[] = [];
            for (let i = 0; i < dashboard.content.definition.queries.length; i++) {
              const query = dashboard.content.definition.queries[i];
              if (query.type !== params.type || query.key !== params.old_key) continue;
              query.key = params.new_key;
              queries.push(query.id);
              updated = true;
            }
            if (updated) {
              await dashboardRepo.save(dashboard);
              const diff = await DashboardChangelogService.createChangelog(originalDashboard, _.cloneDeep(dashboard));
              if (diff) {
                const changelog = new DashboardChangelog();
                changelog.dashboard_id = dashboard.id;
                changelog.diff = diff;
                await dashboardChangelogRepo.save(changelog);
              }
            }
            result.affected_dashboards.push({ dashboardId: dashboard.id, queries });
          }
          job.status = JobStatus.SUCCESS;
          job.result = result;
          await jobRepo.save(job);
          await runner.commitTransaction();
        } catch (error) {
          runner.rollbackTransaction();
          job.status = JobStatus.FAILED;
          job.result = { error };
          await jobRepo.save(job);
        }
      }
      jobs = await jobRepo
        .createQueryBuilder('job')
        .where('type = :type', { type: JobType.RENAME_DATASOURCE })
        .andWhere('status = :status', { status: JobStatus.INIT })
        .orderBy('create_time', 'ASC')
        .getMany();
    }
    await runner.release();
    this.processingRenameDataSource = false;
  }

  static async processFixDashboardPermission(): Promise<void> {
    if (this.processingFixDashboardPermission) {
      return;
    }
    this.processingFixDashboardPermission = true;

    const runner = dashboardDataSource.createQueryRunner();
    await runner.connect();

    const dashboardPermissionRepo = runner.manager.getRepository(DashboardPermission);
    const jobRepo = runner.manager.getRepository(Job);

    let jobs = await jobRepo
      .createQueryBuilder('job')
      .where('type = :type', { type: JobType.FIX_DASHBOARD_PERMISSION })
      .andWhere('status = :status', { status: JobStatus.INIT })
      .orderBy('create_time', 'ASC')
      .getMany();

    while (jobs.length) {
      for (const job of jobs) {
        await runner.startTransaction();
        try {
          const { auth_id, auth_type } = job.params as FixDashboardPermissionJobParams;

          const result: { affected_dashboard_permissions: string[] } = {
            affected_dashboard_permissions: [],
          };

          const dashboardPermissions = await dashboardPermissionRepo.find();
          for (const dashboardPermission of dashboardPermissions) {
            if (
              (dashboardPermission.owner_id === auth_id && dashboardPermission.owner_type === auth_type) ||
              dashboardPermission.can_view.some((x) => {
                return x.id === auth_id && x.type === auth_type;
              }) ||
              dashboardPermission.can_edit.some((x) => {
                return x.id === auth_id && x.type === auth_type;
              })
            ) {
              if (dashboardPermission.owner_id == auth_id && dashboardPermission.owner_type == auth_type) {
                dashboardPermission.owner_id = null;
                dashboardPermission.owner_type = null;
              }
              dashboardPermission.can_view = dashboardPermission.can_view.filter((x) => {
                return x.id !== auth_id || x.type !== auth_type;
              });
              dashboardPermission.can_edit = dashboardPermission.can_edit.filter((x) => {
                return x.id !== auth_id || x.type !== auth_type;
              });
              await dashboardPermissionRepo.save(dashboardPermission);
              result.affected_dashboard_permissions.push(dashboardPermission.id);
            }
          }

          job.status = JobStatus.SUCCESS;
          job.result = result;
          await jobRepo.save(job);
          await runner.commitTransaction();
        } catch (error) {
          runner.rollbackTransaction();
          job.status = JobStatus.FAILED;
          job.result = { error };
          await jobRepo.save(job);
        }
      }
      jobs = await jobRepo
        .createQueryBuilder('job')
        .where('type = :type', { type: JobType.RENAME_DATASOURCE })
        .andWhere('status = :status', { status: JobStatus.INIT })
        .orderBy('create_time', 'ASC')
        .getMany();
    }

    await runner.release();
    this.processingFixDashboardPermission = false;
  }

  async list(
    filter: JobFilterObject | undefined,
    sort: JobSortObject[],
    pagination: PaginationRequest,
  ): Promise<JobPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager
      .createQueryBuilder()
      .from(Job, 'job')
      .where('true')
      .orderBy(sort[0].field, sort[0].order)
      .offset(offset)
      .limit(pagination.pagesize);

    if (filter !== undefined) {
      if (filter.type) {
        filter.type.isFuzzy
          ? qb.andWhere('job.type ilike ANY(:type)', {
              type: filter.type.value.split(';').map((x) => `%${escapeLikePattern(x)}%`),
            })
          : qb.andWhere('job.type = ANY(:type)', { type: filter.type.value.split(';') });
      }
      if (filter.status) {
        filter.status.isFuzzy
          ? qb.andWhere('job.status ilike ANY(:status)', {
              status: filter.status.value.split(';').map((x) => `%${escapeLikePattern(x)}%`),
            })
          : qb.andWhere('job.status = ANY(:status)', { status: filter.status.value.split(';') });
      }
    }

    sort.slice(1).forEach((s) => {
      qb.addOrderBy(s.field, s.order);
    });

    const jobs = await qb.getRawMany<Job>();
    const total = await qb.getCount();
    return {
      total,
      offset,
      data: jobs,
    };
  }
}
