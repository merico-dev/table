import { dashboardDataSource } from '../data_sources/dashboard';
import Dashboard from '../models/dashboard';
import DashboardChangelog from '../models/dashboard_changelog';
import fs from 'fs-extra';
import path from 'path';
import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git';
import {
  DashboardChangelogFilterObject,
  DashboardChangelogPaginationResponse,
  DashboardChangelogSortObject,
} from '../api_models/dashboard_changelog';
import { PaginationRequest } from '../api_models/base';
import logger from 'npmlog';
import { omit } from 'lodash';

export class DashboardChangelogService {
  static async createChangelog(oldDashboard: Dashboard, newDashboard: Dashboard): Promise<string | undefined> {
    const oldData = omit(oldDashboard, ['create_time', 'update_time']);
    const newData = omit(newDashboard, ['create_time', 'update_time']);
    const time = new Date().getTime();
    const dir = path.join(__dirname, `${time}_${oldData.id}`);
    await fs.ensureDir(dir);
    let diff: string | undefined;
    try {
      const options: Partial<SimpleGitOptions> = {
        baseDir: dir,
        binary: 'git',
      };
      const git: SimpleGit = simpleGit(options);
      await git.init();
      await git.addConfig('user.name', 'Devtable');
      await git.addConfig('user.email', 'Devtable@merico.dev');
      const filename = path.join(dir, 'data.json');
      await fs.writeJson(filename, oldData, { spaces: '\t' });
      await git.add(filename);
      await git.commit('First');
      await fs.writeJson(filename, newData, { spaces: '\t' });
      diff = await git.diff();
    } catch (e) {
      logger.warn('create dashboard changelog failed');
      logger.warn(e);
    }
    await fs.rm(dir, { recursive: true, force: true });
    return diff;
  }

  async list(
    filter: DashboardChangelogFilterObject | undefined,
    sort: DashboardChangelogSortObject[],
    pagination: PaginationRequest,
  ): Promise<DashboardChangelogPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager
      .createQueryBuilder()
      .from(DashboardChangelog, 'dc')
      .select('id', 'id')
      .addSelect('dashboard_id', 'dashboard_id')
      .addSelect('diff', 'diff')
      .addSelect('create_time', 'create_time')
      .where('true')
      .orderBy(sort[0].field, sort[0].order)
      .offset(offset)
      .limit(pagination.pagesize);

    if (filter?.dashboard_id) {
      qb.andWhere('dc.dashboard_id = :dashboard_id', { dashboard_id: filter.dashboard_id.value });
    }

    sort.slice(1).forEach((s) => {
      qb.addOrderBy(s.field, s.order);
    });

    const dashboardChangelogs = await qb.getRawMany<DashboardChangelog>();
    const total = await qb.getCount();

    return {
      total,
      offset,
      data: dashboardChangelogs,
    };
  }
}
