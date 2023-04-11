import _ from 'lodash';
import { PaginationRequest } from '../api_models/base';
import {
  DashboardContentFilterObject,
  DashboardContentPaginationResponse,
  DashboardContentSortObject,
} from '../api_models/dashboard_content';
import { ROLE_TYPES } from '../api_models/role';
import { dashboardDataSource } from '../data_sources/dashboard';
import Dashboard from '../models/dashboard';
import { AUTH_ENABLED } from '../utils/constants';
import { ApiError, BAD_REQUEST } from '../utils/errors';
import { escapeLikePattern } from '../utils/helpers';
import { translate } from '../utils/i18n';
import { DashboardPermissionService } from './dashboard_permission.service';
import Account from '../models/account';
import ApiKey from '../models/apiKey';
import DashboardContent from '../models/dashboard_content';
import { DashboardContentChangelogService } from './dashboard_content_changelog.service';
import DashboardContentChangelog from '../models/dashboard_content_changelog';

export class DashboardContentService {
  async list(
    dashboard_id: string,
    filter: DashboardContentFilterObject | undefined,
    sort: DashboardContentSortObject[],
    pagination: PaginationRequest,
  ): Promise<DashboardContentPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager
      .createQueryBuilder()
      .from(DashboardContent, 'dashboard_content')
      .where('dashboard_content.dashboard_id = :dashboard_id', { dashboard_id })
      .orderBy(sort[0].field, sort[0].order)
      .offset(offset)
      .limit(pagination.pagesize);

    if (filter !== undefined) {
      if (filter.name) {
        filter.name.isFuzzy
          ? qb.andWhere('dashboard_content.name ilike :name', { name: `%${escapeLikePattern(filter.name.value)}%` })
          : qb.andWhere('dashboard_content.name = :name', { name: filter.name.value });
      }
    }

    sort.slice(1).forEach((s) => {
      qb.addOrderBy(s.field, s.order);
    });

    const dashboardContents = await qb.getRawMany<DashboardContent>();
    const total = await qb.getCount();

    return {
      total,
      offset,
      data: dashboardContents,
    };
  }

  async create(
    dashboard_id: string,
    name: string,
    content: Record<string, any>,
    locale: string,
  ): Promise<DashboardContent> {
    const dashboardContentRepo = dashboardDataSource.getRepository(DashboardContent);
    if (await dashboardContentRepo.exist({ where: { dashboard_id, name } })) {
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_CONTENT_NAME_ALREADY_EXISTS', locale) });
    }
    const dashboardContent = new DashboardContent();
    dashboardContent.dashboard_id = dashboard_id;
    dashboardContent.name = name;
    dashboardContent.content = content;
    const result = await dashboardContentRepo.save(dashboardContent);
    return result;
  }

  async get(id: string): Promise<DashboardContent> {
    const dashboardContentRepo = dashboardDataSource.getRepository(DashboardContent);
    return await dashboardContentRepo.findOneByOrFail({ id });
  }

  async update(
    id: string,
    name: string | undefined,
    content: Record<string, any> | undefined,
    locale: string,
    auth: Account | ApiKey | null,
  ): Promise<DashboardContent> {
    const dashboardContentRepo = dashboardDataSource.getRepository(DashboardContent);
    const dashboardContent = await dashboardContentRepo.findOneByOrFail({ id });
    const dashboard = await dashboardDataSource
      .getRepository(Dashboard)
      .findOneByOrFail({ id: dashboardContent.dashboard_id });
    await DashboardPermissionService.checkPermission(
      dashboard.id,
      'EDIT',
      auth ? auth.role_id >= ROLE_TYPES.ADMIN : false,
      locale,
      auth ? (auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
      auth?.id,
    );
    if (AUTH_ENABLED && dashboard.is_preset && (!auth?.role_id || auth.role_id < ROLE_TYPES.SUPERADMIN)) {
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
    const originalDashboardContent = _.cloneDeep(dashboardContent);
    dashboardContent.name = name === undefined ? dashboardContent.name : name;
    dashboardContent.content = content === undefined ? dashboardContent.content : content;
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

  async delete(id: string, locale: string, auth: Account | ApiKey | null): Promise<void> {
    const dashboardContentRepo = dashboardDataSource.getRepository(DashboardContent);
    const dashboardContent = await dashboardContentRepo.findOneByOrFail({ id });
    const dashboard = await dashboardDataSource
      .getRepository(Dashboard)
      .findOneByOrFail({ id: dashboardContent.dashboard_id });
    await DashboardPermissionService.checkPermission(
      dashboard.id,
      'EDIT',
      auth ? auth.role_id >= ROLE_TYPES.ADMIN : false,
      locale,
      auth ? (auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
      auth?.id,
    );
    if (AUTH_ENABLED && dashboard.is_preset && (!auth?.role_id || auth.role_id < ROLE_TYPES.SUPERADMIN)) {
      throw new ApiError(BAD_REQUEST, {
        message: translate('DASHBOARD_CONTENT_DELETE_REQUIRES_SUPERADMIN', locale),
      });
    }
    await dashboardContentRepo.delete(dashboardContent.id);
  }
}
