import _ from 'lodash';
import { PaginationRequest } from '../api_models/base';
import { DashboardFilterObject, DashboardSortObject, DashboardPaginationResponse } from '../api_models/dashboard';
import { ROLE_TYPES } from '../api_models/role';
import { dashboardDataSource } from '../data_sources/dashboard';
import Dashboard from '../models/dashboard';
import DashboardChangelog from '../models/dashboard_changelog';
import { AUTH_ENABLED } from '../utils/constants';
import { ApiError, BAD_REQUEST } from '../utils/errors';
import { escapeLikePattern } from '../utils/helpers';
import { DashboardChangelogService } from './dashboard_changelog.service';
import { translate } from '../utils/i18n';

export class DashboardService {
  async list(
    filter: DashboardFilterObject | undefined,
    sort: DashboardSortObject,
    pagination: PaginationRequest,
  ): Promise<DashboardPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager
      .createQueryBuilder()
      .from(Dashboard, 'dashboard')
      .where('true')
      .orderBy(`"${sort.field}"`, sort.order)
      .offset(offset)
      .limit(pagination.pagesize);

    if (filter !== undefined) {
      if (filter.name) {
        filter.name.isFuzzy
          ? qb.andWhere('dashboard.name ilike :name', { name: `%${escapeLikePattern(filter.name.value)}%` })
          : qb.andWhere('dashboard.name = :name', { name: filter.name.value });
      }
      if (filter.group) {
        filter.group.isFuzzy
          ? qb.andWhere('dashboard.group ilike :group', { group: `%${escapeLikePattern(filter.group.value)}%` })
          : qb.andWhere('dashboard.group = :group', { name: filter.group.value });
      }
      if (filter.is_removed !== undefined) {
        qb.andWhere('dashboard.is_removed = :is_removed', { is_removed: filter.is_removed });
      }
    }

    const dashboards = await qb.getRawMany<Dashboard>();
    const total = await qb.getCount();

    return {
      total,
      offset,
      data: dashboards,
    };
  }

  async create(name: string, content: Record<string, any>, group: string): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    const dashboard = new Dashboard();
    dashboard.name = name;
    dashboard.content = content;
    dashboard.group = group;
    const result = await dashboardRepo.save(dashboard);
    return result;
  }

  async get(id: string): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    return await dashboardRepo.findOneByOrFail({ id });
  }

  async getByName(name: string, is_preset: boolean): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    return await dashboardRepo.findOneByOrFail({ name, is_preset });
  }

  async update(
    id: string,
    name: string | undefined,
    content: Record<string, any> | undefined,
    is_removed: boolean | undefined,
    group: string | undefined,
    locale: string,
    role_id?: ROLE_TYPES,
  ): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    const dashboard = await dashboardRepo.findOneByOrFail({ id });
    const originalDashboard = _.cloneDeep(dashboard);
    if (AUTH_ENABLED && dashboard.is_preset && (!role_id || role_id < ROLE_TYPES.SUPERADMIN)) {
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_EDIT_REQUIRES_SUPERADMIN', locale) });
    }
    dashboard.name = name === undefined ? dashboard.name : name;
    dashboard.content = content === undefined ? dashboard.content : content;
    dashboard.is_removed = is_removed === undefined ? dashboard.is_removed : is_removed;
    dashboard.group = group === undefined ? dashboard.group : group;
    const result = await dashboardRepo.save(dashboard);
    const diff = await DashboardChangelogService.createChangelog(originalDashboard, _.cloneDeep(result));
    if (diff) {
      const dashboardChangelogRepo = dashboardDataSource.getRepository(DashboardChangelog);
      const changelog = new DashboardChangelog();
      changelog.dashboard_id = dashboard.id;
      changelog.diff = diff;
      await dashboardChangelogRepo.save(changelog);
    }
    return result;
  }

  async delete(id: string, locale: string, role_id?: ROLE_TYPES): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    const dashboard = await dashboardRepo.findOneByOrFail({ id });
    if (AUTH_ENABLED && dashboard.is_preset && (!role_id || role_id < ROLE_TYPES.SUPERADMIN)) {
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_DELETE_PRESET_REQUIRES_SUPERADMIN', locale) });
    }
    const originalDashboard = _.cloneDeep(dashboard);
    dashboard.is_removed = true;
    const result = await dashboardRepo.save(dashboard);
    const diff = await DashboardChangelogService.createChangelog(originalDashboard, _.cloneDeep(result));
    if (diff) {
      const dashboardChangelogRepo = dashboardDataSource.getRepository(DashboardChangelog);
      const changelog = new DashboardChangelog();
      changelog.dashboard_id = dashboard.id;
      changelog.diff = diff;
      await dashboardChangelogRepo.save(changelog);
    }
    return result;
  }
}
