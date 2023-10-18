import _, { has, omit } from 'lodash';
import { PaginationRequest } from '../api_models/base';
import {
  Content,
  DashboardContentFilterObject,
  DashboardContentPaginationResponse,
  DashboardContentSortObject,
} from '../api_models/dashboard_content';
import { dashboardDataSource } from '../data_sources/dashboard';
import Dashboard from '../models/dashboard';
import { AUTH_ENABLED } from '../utils/constants';
import { ApiError, BAD_REQUEST } from '../utils/errors';
import { applyQueryFilterObjects } from '../utils/helpers';
import { translate } from '../utils/i18n';
import { DashboardPermissionService } from './dashboard_permission.service';
import { Account } from '../api_models/account';
import { ApiKey } from '../api_models/api';
import DashboardContent from '../models/dashboard_content';
import { DashboardContentChangelogService } from './dashboard_content_changelog.service';
import DashboardContentChangelog from '../models/dashboard_content_changelog';
import { HIDDEN_PERMISSIONS } from './role.service';
import DashboardPermission from '../models/dashboard_permission';
import { PermissionResource } from '../api_models/dashboard_permission';
import { injectable } from 'inversify';
import DataSource from '../models/datasource';
import { Any } from 'typeorm';
import { migrateOneDashboardContent } from '../dashboard_migration';

@injectable()
export class DashboardContentService {
  private async checkQueryDatasources(content: Content, locale: string): Promise<void> {
    const dataSourceRepo = dashboardDataSource.getRepository(DataSource);
    const errors: { [type: string]: string[] } = {};
    const keys = new Set(content.definition.queries.map((x) => x.key));
    const sources = await dataSourceRepo.findBy({ key: Any(Array.from(keys)) });
    content.definition.queries.forEach((q) => {
      if (!sources.find((s) => s.type === q.type && s.key === q.key)) {
        if (!errors[q.type]) {
          errors[q.type] = [];
        }
        if (!errors[q.type].includes(q.key)) {
          errors[q.type].push(q.key);
        }
      }
    });
    if (!_.isEmpty(errors)) {
      throw new ApiError(BAD_REQUEST, {
        message: translate('DATASOURCE_MISSING', locale),
        missing: errors,
      });
    }
  }

  async list(
    dashboard_id: string,
    filter: DashboardContentFilterObject | undefined,
    sort: DashboardContentSortObject[],
    pagination: PaginationRequest,
    auth?: Account | ApiKey,
  ): Promise<DashboardContentPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager
      .createQueryBuilder()
      .from(DashboardContent, 'dashboard_content')
      .innerJoin(
        DashboardPermission,
        'dashboard_permission',
        'dashboard_content.dashboard_id = dashboard_permission.id',
      )
      .select('dashboard_content.*')
      .addSelect('dashboard_permission.owner_id', 'owner_id')
      .addSelect('dashboard_permission.owner_type', 'owner_type')
      .addSelect('dashboard_permission.access', 'access')
      .where('dashboard_content.dashboard_id = :dashboard_id', { dashboard_id })
      .orderBy(sort[0].field, sort[0].order)
      .offset(offset)
      .limit(pagination.pagesize);

    applyQueryFilterObjects(qb, [{ property: 'name', type: 'FilterObject' }], 'dashboard_content', filter);

    sort.slice(1).forEach((s) => {
      qb.addOrderBy(s.field, s.order);
    });

    const dashboardContents = await qb.getRawMany<
      DashboardContent & {
        owner_id: string | null;
        owner_type: 'ACCOUNT' | 'APIKEY' | null;
        access: PermissionResource[];
      }
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
      data: dashboardContents
        .filter((x) =>
          DashboardPermissionService.canAccess(
            { access: x.access, owner_id: x.owner_id, owner_type: x.owner_type },
            'VIEW',
            auth_id,
            auth_type,
            auth_role_id,
            auth_permissions,
          ),
        )
        .map((x) => ({ ...omit(x, ['owner_id', 'owner_type', 'access']) })),
    };
  }

  async create(dashboard_id: string, name: string, content: Content, locale: string): Promise<DashboardContent> {
    const dashboardContentRepo = dashboardDataSource.getRepository(DashboardContent);
    if (await dashboardContentRepo.exist({ where: { dashboard_id, name } })) {
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_CONTENT_NAME_ALREADY_EXISTS', locale) });
    }
    await this.checkQueryDatasources(content, locale);
    const dashboardContent = new DashboardContent();
    dashboardContent.dashboard_id = dashboard_id;
    dashboardContent.name = name;
    dashboardContent.content = content;
    if (!(await migrateOneDashboardContent(dashboardContent))) {
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_CONTENT_MIGRATION_FAILED', locale) });
    }
    return dashboardContentRepo.save(dashboardContent);
  }

  async get(id: string): Promise<DashboardContent> {
    const dashboardContentRepo = dashboardDataSource.getRepository(DashboardContent);
    return dashboardContentRepo.findOneByOrFail({ id });
  }

  async update(
    id: string,
    name: string | undefined,
    content: Content | undefined,
    locale: string,
    auth?: Account | ApiKey,
  ): Promise<DashboardContent> {
    const dashboardContentRepo = dashboardDataSource.getRepository(DashboardContent);
    const dashboardContent = await dashboardContentRepo.findOneByOrFail({ id });
    const dashboard = await dashboardDataSource
      .getRepository(Dashboard)
      .findOneByOrFail({ id: dashboardContent.dashboard_id });
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
    await DashboardPermissionService.checkPermission(
      dashboard.id,
      'EDIT',
      locale,
      auth_id,
      auth_type,
      auth_role_id,
      auth_permissions,
    );
    if (AUTH_ENABLED && dashboard.is_preset && (!auth || !auth.permissions.includes(HIDDEN_PERMISSIONS.PRESET))) {
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_CONTENT_EDIT_REQUIRES_SUPERADMIN', locale) });
    }
    if (name === undefined && content === undefined) {
      return dashboardContent;
    }
    if (name !== undefined && dashboardContent.name !== name) {
      if (await dashboardContentRepo.exist({ where: { name, dashboard_id: dashboardContent.dashboard_id } })) {
        throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_CONTENT_NAME_ALREADY_EXISTS', locale) });
      }
    }
    if (content !== undefined) {
      await this.checkQueryDatasources(content, locale);
    }
    const originalDashboardContent = _.cloneDeep(dashboardContent);
    dashboardContent.name = name === undefined ? dashboardContent.name : name;
    dashboardContent.content = content === undefined ? dashboardContent.content : content;
    if (!(await migrateOneDashboardContent(dashboardContent))) {
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_CONTENT_MIGRATION_FAILED', locale) });
    }
    await dashboardContentRepo.save(dashboardContent);
    const result = await dashboardContentRepo.findOneByOrFail({ id });
    const diff = await DashboardContentChangelogService.createChangelog(originalDashboardContent, _.cloneDeep(result));
    if (diff) {
      const dashboardContentChangelogRepo = dashboardDataSource.getRepository(DashboardContentChangelog);
      const changelog = new DashboardContentChangelog();
      changelog.dashboard_content_id = dashboardContent.id;
      changelog.diff = diff;
      await dashboardContentChangelogRepo.save(changelog);
    }
    return result;
  }

  async delete(id: string, locale: string, auth?: Account | ApiKey): Promise<void> {
    const dashboardContentRepo = dashboardDataSource.getRepository(DashboardContent);
    const dashboardContent = await dashboardContentRepo.findOneByOrFail({ id });
    const dashboard = await dashboardDataSource
      .getRepository(Dashboard)
      .findOneByOrFail({ id: dashboardContent.dashboard_id });
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
    await DashboardPermissionService.checkPermission(
      dashboard.id,
      'EDIT',
      locale,
      auth_id,
      auth_type,
      auth_role_id,
      auth_permissions,
    );
    if (
      AUTH_ENABLED &&
      dashboard.is_preset &&
      (!auth?.role_id || !auth.permissions.includes(HIDDEN_PERMISSIONS.PRESET))
    ) {
      throw new ApiError(BAD_REQUEST, {
        message: translate('DASHBOARD_CONTENT_DELETE_REQUIRES_SUPERADMIN', locale),
      });
    }
    await dashboardContentRepo.delete(dashboardContent.id);
  }
}
