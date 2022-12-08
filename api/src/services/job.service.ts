import { PaginationRequest } from '../api_models/base';
import { JobFilterObject, JobPaginationResponse, JobSortObject } from '../api_models/job';
import { dashboardDataSource } from '../data_sources/dashboard';
import Dashboard from '../models/dashboard';
import DataSource from '../models/datasource';
import Job from '../models/job';
import { escapeLikePattern } from '../utils/helpers';

enum JobType {
  RENAME_DATASOURCE = 'RENAME_DATASOURCE',
}

enum JobStatus {
  INIT = 'INIT',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS'
}

export type RenameJobParams = {
  type: string;
  old_key: string;
  new_key: string;
}

export class JobService {
  static processingRenameDataSource = false;

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

  static async processDataSourceRename(): Promise<void> {
    if (this.processingRenameDataSource) {
      return;
    }
    this.processingRenameDataSource = true;

    const runner = dashboardDataSource.createQueryRunner();
    await runner.connect();

    const datasourceRepo = runner.manager.getRepository(DataSource);
    const dashboardRepo = runner.manager.getRepository(Dashboard);
    const jobRepo = runner.manager.getRepository(Job);

    const jobs = await jobRepo.createQueryBuilder('job')
      .where('type = :type', { type: JobType.RENAME_DATASOURCE })
      .andWhere('status = :status', { status: JobStatus.INIT })
      .orderBy('create_time', 'ASC')
      .getMany();
    
    for (const job of jobs) {
      await runner.startTransaction();
      try {
        const params = job.params as RenameJobParams;

        const datasource = await datasourceRepo.findOneByOrFail({ type: params.type, key: params.old_key });
        datasource.key = params.new_key;
        await datasourceRepo.save(datasource);

        const result: { affected_dashboards: { dashboardId: string, queries: string[] }[] } = { affected_dashboards: [] };

        const dashboards = await runner.manager.createQueryBuilder()
          .from(Dashboard, 'dashboard')
          .where(`content @> '{"definition":{"queries":[{"type": "${params.type}", "key": "${params.old_key}"}]}}' `)
          .getRawMany<Dashboard>();

        for (const dashboard of dashboards) {
          const queries: string[] = [];
          for (let i = 0; i < dashboard.content.definition.queries.length; i++) {
            const query = dashboard.content.definition.queries[i];
            if (query.type !== params.type || query.key !== params.old_key) continue;
            query.key = params.new_key;
            await dashboardRepo.save(dashboard);
            queries.push(query.id);
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
    await runner.release();
    this.processingRenameDataSource = false;
  }

  async list(filter: JobFilterObject | undefined, sort: JobSortObject, pagination: PaginationRequest): Promise<JobPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager.createQueryBuilder()
      .from(Job, 'job')
      .orderBy(sort.field, sort.order)
      .offset(offset).limit(pagination.pagesize);

    if (filter?.search) {
      qb.where('job.type ilike :typeSearch OR job.status ilike :keySearch', { typeSearch: `%${escapeLikePattern(filter.search)}%`, keySearch: `%${escapeLikePattern(filter.search)}%` });
    }

    const jobs = await qb.getRawMany<Job>();
    const total = await qb.getCount();
    return {
      total,
      offset,
      data: jobs,
    };
  }
}
