import _ from 'lodash';
import { PaginationRequest } from '../api_models/base';
import {
  DashboardPermission as DashboardPermissionAPIModel,
  DashboardPermissionFilterObject,
  DashboardPermissionPaginationResponse,
  DashboardPermissionSortObject,
  PermissionResource,
} from '../api_models/dashboard_permission';
import { ROLE_TYPES } from '../api_models/role';
import { dashboardDataSource } from '../data_sources/dashboard';
import Account from '../models/account';
import ApiKey from '../models/apiKey';
import DashboardPermission from '../models/dashboard_permission';
import { AUTH_ENABLED } from '../utils/constants';
import { ApiError, BAD_REQUEST, FORBIDDEN } from '../utils/errors';
import { escapeLikePattern } from '../utils/helpers';
import { translate } from '../utils/i18n';

export class DashboardPermissionService {
  static async create(dashboard_id: string, owner_id?: string, owner_type?: 'ACCOUNT' | 'APIKEY'): Promise<void> {
    const dashboardPermissionRepo = dashboardDataSource.getRepository(DashboardPermission);
    const permission = new DashboardPermission();
    permission.dashboard_id = dashboard_id;
    permission.owner_id = owner_id ?? null;
    permission.owner_type = owner_type ?? null;
    await dashboardPermissionRepo.save(permission);
  }

  static async checkPermission(
    dashboard_id: string,
    permission_type: 'VIEW' | 'EDIT',
    is_admin: boolean,
    locale: string,
    resource_type?: 'ACCOUNT' | 'APIKEY',
    resource_id?: string,
  ): Promise<void> {
    if (!AUTH_ENABLED) return;
    if (is_admin) return;
    const dashboardPermissionRepo = dashboardDataSource.getRepository(DashboardPermission);
    const dashboardPermission = await dashboardPermissionRepo.findOneByOrFail({ dashboard_id });
    if (!dashboardPermission.owner_id || !dashboardPermission.owner_type) return;
    let allowed: PermissionResource[] = [];
    if (permission_type === 'VIEW') {
      if (dashboardPermission.can_view.length === 0) return;
      allowed = dashboardPermission.can_view.concat([
        { id: dashboardPermission.owner_id, type: dashboardPermission.owner_type },
      ]);
    } else {
      if (dashboardPermission.can_edit.length === 0) return;
      allowed = dashboardPermission.can_edit.concat([
        { id: dashboardPermission.owner_id, type: dashboardPermission.owner_type },
      ]);
    }
    if (
      allowed.some((x) => {
        return x.id === resource_id && x.type === resource_type;
      })
    )
      return;
    throw new ApiError(FORBIDDEN, { message: translate('DASHBOARD_PERMISSION_FORBIDDEN', locale) });
  }

  static async checkIsOwnerOrAdmin(dashboard_id: string, auth: Account | ApiKey, locale: string): Promise<void> {
    if (!AUTH_ENABLED) return;
    if (auth.role_id >= ROLE_TYPES.ADMIN) return;
    const dashboardPermissionRepo = dashboardDataSource.getRepository(DashboardPermission);
    const dashboardPermission = await dashboardPermissionRepo.findOneByOrFail({ dashboard_id });
    if (
      dashboardPermission.owner_id === auth.id &&
      dashboardPermission.owner_type === (auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT')
    )
      return;
    throw new ApiError(FORBIDDEN, { message: translate('DASHBOARD_PERMISSION_FORBIDDEN', locale) });
  }

  async list(
    filter: DashboardPermissionFilterObject | undefined,
    sort: DashboardPermissionSortObject[],
    pagination: PaginationRequest,
  ): Promise<DashboardPermissionPaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager
      .createQueryBuilder()
      .from(DashboardPermission, 'dashboard_permission')
      .where('true')
      .orderBy(sort[0].field, sort[0].order)
      .offset(offset)
      .limit(pagination.pagesize);

    if (filter !== undefined) {
      if (filter.dashboard_id) {
        qb.andWhere('dashboard_permission.dashboard_id = :dashboard_id', { dashboard_id: filter.dashboard_id.value });
      }
      if (filter.owner_id) {
        qb.andWhere('dashboard_permission.owner_id = :owner_id', { owner_id: filter.owner_id.value });
      }
      if (filter.owner_type) {
        filter.owner_type.isFuzzy
          ? qb.andWhere('dashboard_permission.owner_type ilike ANY(:owner_type)', {
              owner_type: filter.owner_type.value.split(';').map((x) => `%${escapeLikePattern(x)}%`),
            })
          : qb.andWhere('dashboard_permission.owner_type = ANY(:owner_type)', {
              owner_type: filter.owner_type.value.split(';'),
            });
      }
    }

    sort.slice(1).forEach((s) => {
      qb.addOrderBy(s.field, s.order);
    });

    const dashboardPermissions = await qb.getRawMany<DashboardPermission>();
    const total = await qb.getCount();

    return {
      total,
      offset,
      data: dashboardPermissions,
    };
  }

  async updateOwner(
    dashboard_id: string,
    owner_id: string,
    owner_type: 'ACCOUNT' | 'APIKEY',
    auth: Account | ApiKey,
    locale: string,
  ): Promise<DashboardPermissionAPIModel> {
    const dashboardPermissionRepo = dashboardDataSource.getRepository(DashboardPermission);
    const dashboardPermission = await dashboardPermissionRepo.findOneByOrFail({ dashboard_id });
    await DashboardPermissionService.checkIsOwnerOrAdmin(dashboard_id, auth, locale);
    const newOwnerRepo =
      owner_type === 'ACCOUNT' ? dashboardDataSource.getRepository(Account) : dashboardDataSource.getRepository(ApiKey);
    const newOwner = await newOwnerRepo.findOneByOrFail({ id: owner_id });
    if (newOwner.role_id < ROLE_TYPES.AUTHOR) {
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_OWNER_INSUFFICIENT_PRIVILEGES', locale) });
    }
    dashboardPermission.owner_id = owner_id;
    dashboardPermission.owner_type = owner_type;
    dashboardPermission.can_view = this.modifyPermissions(
      'ADD',
      { id: dashboardPermission.owner_id, type: dashboardPermission.owner_type },
      dashboardPermission.can_view,
      [],
    );
    dashboardPermission.can_edit = this.modifyPermissions(
      'ADD',
      { id: dashboardPermission.owner_id, type: dashboardPermission.owner_type },
      dashboardPermission.can_edit,
      [],
    );
    const result = await dashboardPermissionRepo.save(dashboardPermission);
    return result;
  }

  async update(
    dashboard_id: string,
    direction: 'ADD' | 'REMOVE',
    can_view: PermissionResource[] = [],
    can_edit: PermissionResource[] = [],
    auth: Account | ApiKey,
    locale: string,
  ): Promise<DashboardPermissionAPIModel> {
    const dashboardPermissionRepo = dashboardDataSource.getRepository(DashboardPermission);
    const dashboardPermission = await dashboardPermissionRepo.findOneByOrFail({ dashboard_id });
    await DashboardPermissionService.checkIsOwnerOrAdmin(dashboard_id, auth, locale);
    if (!dashboardPermission.owner_id || !dashboardPermission.owner_type) {
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_PERMISSION_NO_OWNER', locale) });
    }
    dashboardPermission.can_view = this.modifyPermissions(
      direction,
      { id: dashboardPermission.owner_id, type: dashboardPermission.owner_type },
      dashboardPermission.can_view,
      can_view,
    );
    dashboardPermission.can_edit = this.modifyPermissions(
      direction,
      { id: dashboardPermission.owner_id, type: dashboardPermission.owner_type },
      dashboardPermission.can_edit,
      can_edit,
    );
    const result = await dashboardPermissionRepo.save(dashboardPermission);
    return result;
  }

  private modifyPermissions(
    direction: 'ADD' | 'REMOVE',
    owner: { id: string; type: 'ACCOUNT' | 'APIKEY' },
    existing: PermissionResource[],
    updates: PermissionResource[],
  ): PermissionResource[] {
    if (direction === 'ADD') {
      return _.uniqWith(
        existing.concat(updates).filter((x) => {
          return x.id !== owner.id || x.type !== owner.type;
        }),
        (x, y) => x.id === y.id && x.type === y.type,
      );
    } else {
      return existing.filter((x) => {
        return !updates.some((y) => y.id === x.id && y.type === x.type);
      });
    }
  }
}
