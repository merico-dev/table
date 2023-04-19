import { dashboardDataSource } from '../data_sources/dashboard';
import DashboardContent from '../models/dashboard_content';
import DashboardContentChangelog from '../models/dashboard_content_changelog';
import {
  DashboardContentChangelogFilterObject,
  DashboardContentChangelogPaginationResponse,
  DashboardContentChangelogSortObject,
} from '../api_models/dashboard_content_changelog';
import { PaginationRequest } from '../api_models/base';
import { getDiff, omitTime } from '../utils/helpers';

export class DashboardContentChangelogService {
  static async createChangelog(
    oldDashboardContent: DashboardContent,
    newDashboardContent: DashboardContent,
  ): Promise<string | undefined> {
    const oldData = omitTime(oldDashboardContent);
    const newData = omitTime(newDashboardContent);
    return await getDiff(oldData, newData);
  }

  async list(
    filter: DashboardContentChangelogFilterObject | undefined,
    sort: DashboardContentChangelogSortObject[],
    pagination: PaginationRequest,
  ): Promise<DashboardContentChangelogPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager
      .createQueryBuilder()
      .from(DashboardContentChangelog, 'dcc')
      .select('id', 'id')
      .addSelect('dashboard_content_id', 'dashboard_content_id')
      .addSelect('diff', 'diff')
      .addSelect('create_time', 'create_time')
      .where('true')
      .orderBy(sort[0].field, sort[0].order)
      .offset(offset)
      .limit(pagination.pagesize);

    if (filter?.dashboard_content_id) {
      qb.andWhere('dashboard_content_id = :dashboard_content_id', {
        dashboard_content_id: filter.dashboard_content_id.value,
      });
    }

    sort.slice(1).forEach((s) => {
      qb.addOrderBy(s.field, s.order);
    });

    const dashboardContentChangelogs = await qb.getRawMany<DashboardContentChangelog>();
    const total = await qb.getCount();

    return {
      total,
      offset,
      data: dashboardContentChangelogs,
    };
  }
}
