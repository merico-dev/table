import { dashboardDataSource } from '../data_sources/dashboard';
import Dashboard from '../models/dashboard';
import DashboardChangelog from '../models/dashboard_changelog';
import {
  DashboardChangelogFilterObject,
  DashboardChangelogPaginationResponse,
  DashboardChangelogSortObject,
} from '../api_models/dashboard_changelog';
import { PaginationRequest } from '../api_models/base';
import { applyQueryFilterObjects, getDiff, omitFields } from '../utils/helpers';
import { injectable } from 'inversify';

@injectable()
export class DashboardChangelogService {
  static async createChangelog(oldDashboard: Dashboard, newDashboard: Dashboard): Promise<string | undefined> {
    const oldData = omitFields(oldDashboard, ['create_time', 'update_time']);
    const newData = omitFields(newDashboard, ['create_time', 'update_time']);
    return getDiff(oldData, newData);
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

    applyQueryFilterObjects(qb, [{ property: 'dashboard_id', type: 'FilterObjectNoFuzzy' }], 'dc', filter);

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
