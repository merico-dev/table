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
import { DashboardPermissionService } from './dashboard_permission.service';
import Account from '../models/account';
import ApiKey from '../models/apiKey';
import DashboardPermission from '../models/dashboard_permission';
import { PermissionResource } from '../api_models/dashboard_permission';
import DashboardContent from '../models/dashboard_content';

export class DashboardService {
  async list(
    filter: DashboardFilterObject | undefined,
    sort: DashboardSortObject[],
    pagination: PaginationRequest,
    auth?: Account | ApiKey,
  ): Promise<DashboardPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager
      .createQueryBuilder()
      .from(Dashboard, 'dashboard')
      .innerJoin(DashboardPermission, 'dashboard_permission', 'dashboard.id = dashboard_permission.id')
      .select('dashboard.*')
      .addSelect('dashboard_permission.owner_id', 'owner_id')
      .addSelect('dashboard_permission.owner_type', 'owner_type')
      .addSelect('dashboard_permission.access', 'access')
      .where('true')
      .orderBy(`dashboard."${sort[0].field}"`, sort[0].order)
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

    sort.slice(1).forEach((s) => {
      qb.addOrderBy(`dashboard."${s.field}"`, s.order);
    });

    const dashboards = await qb.getRawMany<
      Dashboard & { owner_id: string | null; owner_type: 'ACCOUNT' | 'APIKEY' | null; access: PermissionResource[] }
    >();
    const total = await qb.getCount();

    return {
      total,
      offset,
      data: dashboards.filter((x) =>
        DashboardPermissionService.canAccess(
          { access: x.access, owner_id: x.owner_id, owner_type: x.owner_type },
          'VIEW',
          auth?.id,
          auth ? (auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
          auth?.role_id,
        ),
      ),
    };
  }

  async create(name: string, group: string, locale: string, auth?: Account | ApiKey): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    if (await dashboardRepo.exist({ where: { name, is_preset: false, is_removed: false } })) {
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_NAME_ALREADY_EXISTS', locale) });
    }
    const dashboard = new Dashboard();
    dashboard.name = name;
    dashboard.group = group;
    const result = await dashboardRepo.save(dashboard);

    await DashboardPermissionService.create(
      result.id,
      auth?.id,
      auth ? (auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
    );
    return result;
  }

  async get(id: string): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    return await dashboardRepo.findOneByOrFail({ id });
  }

  async getByName(name: string, is_preset: boolean): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    return await dashboardRepo.findOneByOrFail({ name, is_preset, is_removed: false });
  }

  async update(
    id: string,
    name: string | undefined,
    content_id: string | null | undefined,
    is_removed: boolean | undefined,
    group: string | undefined,
    locale: string,
    role_id?: ROLE_TYPES,
  ): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    const dashboardContentRepo = dashboardDataSource.getRepository(DashboardContent);
    const dashboard = await dashboardRepo.findOneByOrFail({ id });
    if (name === undefined && content_id === undefined && is_removed === undefined && group === undefined) {
      return dashboard;
    }
    if (name !== undefined && dashboard.name !== name) {
      if (await dashboardRepo.exist({ where: { name, is_removed: false, is_preset: dashboard.is_preset } })) {
        throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_NAME_ALREADY_EXISTS', locale) });
      }
    }
    if (content_id !== undefined && content_id !== null) {
      if (!(await dashboardContentRepo.exist({ where: { id: content_id, dashboard_id: id } }))) {
        throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_CONTENT_DOES_NOT_EXIST', locale) });
      }
    }
    const originalDashboard = _.cloneDeep(dashboard);
    if (AUTH_ENABLED && dashboard.is_preset && (!role_id || role_id < ROLE_TYPES.SUPERADMIN)) {
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_EDIT_REQUIRES_SUPERADMIN', locale) });
    }
    dashboard.name = name === undefined ? dashboard.name : name;
    dashboard.content_id = content_id === undefined ? dashboard.content_id : content_id;
    dashboard.is_removed = is_removed === undefined ? dashboard.is_removed : is_removed;
    dashboard.group = group === undefined ? dashboard.group : group;
    await dashboardRepo.save(dashboard);
    const result = await dashboardRepo.findOneByOrFail({ id });
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
    await dashboardRepo.save(dashboard);
    const result = await dashboardRepo.findOneByOrFail({ id });
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
