import { dashboardDataSource } from '../data_sources/dashboard';
import DashboardContent from '../models/dashboard_content';
import DashboardContentChangelog from '../models/dashboard_content_changelog';
import {
  DashboardContentChangelogFilterObject,
  DashboardContentChangelogPaginationResponse,
  DashboardContentChangelogSortObject,
} from '../api_models/dashboard_content_changelog';
import { PaginationRequest } from '../api_models/base';
import { applyQueryFilterObjects, getDiff, omitFields } from '../utils/helpers';
import { injectable } from 'inversify';

@injectable()
export class DashboardContentChangelogService {
  static async createChangelog(
    oldDashboardContent: DashboardContent,
    newDashboardContent: DashboardContent,
  ): Promise<string | undefined> {
    const oldData = omitFields(oldDashboardContent, ['create_time', 'update_time']);
    const newData = omitFields(newDashboardContent, ['create_time', 'update_time']);
    return getDiff(oldData, newData);
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

    applyQueryFilterObjects(qb, [{ property: 'dashboard_content_id', type: 'FilterObjectNoFuzzy' }], 'dcc', filter);

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
