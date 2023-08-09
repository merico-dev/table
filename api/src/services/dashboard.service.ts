import _, { has } from 'lodash';
import { PaginationRequest } from '../api_models/base';
import { DashboardFilterObject, DashboardSortObject, DashboardPaginationResponse } from '../api_models/dashboard';
import { dashboardDataSource } from '../data_sources/dashboard';
import Dashboard from '../models/dashboard';
import DashboardChangelog from '../models/dashboard_changelog';
import { AUTH_ENABLED } from '../utils/constants';
import { ApiError, BAD_REQUEST } from '../utils/errors';
import { applyQueryFilterObjects } from '../utils/helpers';
import { DashboardChangelogService } from './dashboard_changelog.service';
import { translate } from '../utils/i18n';
import { DashboardPermissionService } from './dashboard_permission.service';
import { Account } from '../api_models/account';
import { ApiKey } from '../api_models/api';
import DashboardPermission from '../models/dashboard_permission';
import { PermissionResource } from '../api_models/dashboard_permission';
import DashboardContent from '../models/dashboard_content';
import { injectable } from 'inversify';
import { HIDDEN_PERMISSIONS } from './role.service';

@injectable()
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

    applyQueryFilterObjects(
      qb,
      [
        { property: 'name', type: 'FilterObject' },
        { property: 'group', type: 'FilterObject' },
        { property: 'is_removed', type: 'Primitive' },
      ],
      'dashboard',
      filter,
    );

    sort.slice(1).forEach((s) => {
      qb.addOrderBy(`dashboard."${s.field}"`, s.order);
    });

    const dashboards = await qb.getRawMany<
      Dashboard & { owner_id: string | null; owner_type: 'ACCOUNT' | 'APIKEY' | null; access: PermissionResource[] }
    >();
    const total = await qb.getCount();

    let auth_id: string | undefined;
    let auth_type: 'APIKEY' | 'ACCOUNT' | undefined;
    let auth_role_id: string | undefined;
    let auth_permissions: string[] | undefined;
    if (auth) {
      auth_id = auth.id;
      auth_type = has(auth, 'app_id') ? 'APIKEY' : 'ACCOUNT';
      auth_role_id = auth.role_id;
      auth_permissions = auth.permissions;
    }

    return {
      total,
      offset,
      data: dashboards.filter((x) =>
        DashboardPermissionService.canAccess(
          { access: x.access, owner_id: x.owner_id, owner_type: x.owner_type },
          'VIEW',
          auth_id,
          auth_type,
          auth_role_id,
          auth_permissions,
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

    let auth_id: string | undefined;
    let auth_type: 'APIKEY' | 'ACCOUNT' | undefined;
    if (auth) {
      auth_id = auth.id;
      auth_type = has(auth, 'app_id') ? 'APIKEY' : 'ACCOUNT';
    }
    await DashboardPermissionService.create(result.id, auth_id, auth_type);
    return result;
  }

  async get(id: string): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    return dashboardRepo.findOneByOrFail({ id });
  }

  async getByName(name: string, is_preset: boolean): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    return dashboardRepo.findOneByOrFail({ name, is_preset, is_removed: false });
  }

  async update(
    id: string,
    name: string | undefined,
    content_id: string | null | undefined,
    is_removed: boolean | undefined,
    group: string | undefined,
    locale: string,
    permissions?: string[],
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
    if (AUTH_ENABLED && dashboard.is_preset && (!permissions || !permissions.includes(HIDDEN_PERMISSIONS.PRESET))) {
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

  async delete(id: string, locale: string, permissions?: string[]): Promise<Dashboard> {
    const dashboardRepo = dashboardDataSource.getRepository(Dashboard);
    const dashboard = await dashboardRepo.findOneByOrFail({ id });
    if (AUTH_ENABLED && dashboard.is_preset && (!permissions || !permissions.includes(HIDDEN_PERMISSIONS.PRESET))) {
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
