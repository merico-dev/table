import _ from 'lodash';
import { Any } from 'typeorm';
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
  static async create(id: string, owner_id?: string, owner_type?: 'ACCOUNT' | 'APIKEY'): Promise<void> {
    const dashboardPermissionRepo = dashboardDataSource.getRepository(DashboardPermission);
    const permission = new DashboardPermission();
    permission.id = id;
    permission.owner_id = owner_id ?? null;
    permission.owner_type = owner_type ?? null;
    await dashboardPermissionRepo.save(permission);
  }

  static canAccess(
    permission: { owner_id: string | null; owner_type: 'ACCOUNT' | 'APIKEY' | null; access: PermissionResource[] },
    permission_type: 'VIEW' | 'EDIT',
    auth_id?: string,
    auth_type?: 'ACCOUNT' | 'APIKEY',
    auth_role_id?: ROLE_TYPES,
  ): boolean {
    if (!AUTH_ENABLED) return true;
    if (auth_role_id && auth_role_id >= ROLE_TYPES.ADMIN) return true;
    if (!permission.owner_id || !permission.owner_type) return true;
    if (permission.access.length === 0) return true;

    // NOTE: check access by role
    if (auth_role_id) {
      const controlled = permission.access.some(
        (x) => x.permission === permission_type || (x.id === auth_id && x.type === auth_type),
      );
      if (!controlled) {
        if (permission_type === 'VIEW') {
          return auth_role_id >= ROLE_TYPES.READER;
        }
        return auth_role_id >= ROLE_TYPES.AUTHOR;
      }
    }

    // NOTE: check access by permission.access
    let allowed: PermissionResource[] = [];
    if (permission_type === 'VIEW') {
      allowed = permission.access.concat([
        { id: permission.owner_id, type: permission.owner_type, permission: 'EDIT' },
      ]);
    } else {
      allowed = permission.access
        .concat([{ id: permission.owner_id, type: permission.owner_type, permission: 'EDIT' }])
        .filter((x) => {
          return x.permission === 'EDIT';
        });
    }
    if (
      allowed.some((x) => {
        return x.id === auth_id && x.type === auth_type;
      })
    ) {
      return true;
    }
    return false;
  }

  static async checkPermission(
    id: string,
    permission_type: 'VIEW' | 'EDIT',
    locale: string,
    resource_id?: string,
    resource_type?: 'ACCOUNT' | 'APIKEY',
    resource_role_id?: ROLE_TYPES,
  ): Promise<void> {
    const dashboardPermissionRepo = dashboardDataSource.getRepository(DashboardPermission);
    const dashboardPermission = await dashboardPermissionRepo.findOneByOrFail({ id });
    if (!this.canAccess(dashboardPermission, permission_type, resource_id, resource_type, resource_role_id)) {
      throw new ApiError(FORBIDDEN, { message: translate('DASHBOARD_PERMISSION_FORBIDDEN', locale) });
    }
  }

  static async checkIsOwnerOrAdmin(id: string, auth: Account | ApiKey, locale: string): Promise<void> {
    if (!AUTH_ENABLED) return;
    if (auth.role_id >= ROLE_TYPES.ADMIN) return;
    const dashboardPermissionRepo = dashboardDataSource.getRepository(DashboardPermission);
    const dashboardPermission = await dashboardPermissionRepo.findOneByOrFail({ id });
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
      if (filter.id) {
        qb.andWhere('dashboard_permission.id = :id', { id: filter.id.value });
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

  async get(id: string): Promise<DashboardPermissionAPIModel> {
    const dashboardPermissionRepo = dashboardDataSource.getRepository(DashboardPermission);
    const dp = await dashboardPermissionRepo.findOneByOrFail({ id });
    let accountIds = dp.access.filter((x) => x.type === 'ACCOUNT').map((x) => x.id);
    if (dp.owner_id) {
      accountIds.push(dp.owner_id);
    }
    accountIds = Array.from(new Set(accountIds));
    const accounts = await dashboardDataSource.getRepository(Account).findBy({ id: Any(accountIds) });
    const accountMap = _.keyBy(accounts, 'id');
    const access = dp.access.map((x) => ({
      ...x,
      name: accountMap[x.id]?.name ?? x.id,
    }));
    const owner_id = dp.owner_id ? dp.owner_id : '';
    const owner_name = owner_id ? _.get(accountMap, owner_id)?.name : owner_id;
    return {
      ...dp,
      access,
      owner_name,
    };
  }

  async updateOwner(
    id: string,
    owner_id: string,
    owner_type: 'ACCOUNT' | 'APIKEY',
    auth: Account | ApiKey,
    locale: string,
  ): Promise<DashboardPermissionAPIModel> {
    const dashboardPermissionRepo = dashboardDataSource.getRepository(DashboardPermission);
    const dashboardPermission = await dashboardPermissionRepo.findOneByOrFail({ id });
    await DashboardPermissionService.checkIsOwnerOrAdmin(id, auth, locale);
    const newOwnerRepo =
      owner_type === 'ACCOUNT' ? dashboardDataSource.getRepository(Account) : dashboardDataSource.getRepository(ApiKey);
    const newOwner = await newOwnerRepo.findOneByOrFail({ id: owner_id });
    if (newOwner.role_id < ROLE_TYPES.AUTHOR) {
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_OWNER_INSUFFICIENT_PRIVILEGES', locale) });
    }
    dashboardPermission.owner_id = owner_id;
    dashboardPermission.owner_type = owner_type;
    dashboardPermission.access = this.modifyPermissions(
      { id: dashboardPermission.owner_id, type: dashboardPermission.owner_type },
      dashboardPermission.access,
      [],
    );
    await dashboardPermissionRepo.save(dashboardPermission);
    const result = await dashboardPermissionRepo.findOneByOrFail({ id });
    return result;
  }

  async update(
    id: string,
    access: PermissionResource[] = [],
    auth: Account | ApiKey,
    locale: string,
  ): Promise<DashboardPermissionAPIModel> {
    const dashboardPermissionRepo = dashboardDataSource.getRepository(DashboardPermission);
    const dashboardPermission = await dashboardPermissionRepo.findOneByOrFail({ id });
    await DashboardPermissionService.checkIsOwnerOrAdmin(id, auth, locale);
    if (!dashboardPermission.owner_id || !dashboardPermission.owner_type) {
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_PERMISSION_NO_OWNER', locale) });
    }

    let apiKeyIds = access
      .filter((x) => {
        return x.type === 'APIKEY' && x.permission !== 'REMOVE';
      })
      .map((x) => x.id);
    apiKeyIds = Array.from(new Set(apiKeyIds));
    const existingApiKeys = await dashboardDataSource.getRepository(ApiKey).findBy({ id: Any(apiKeyIds) });
    if (existingApiKeys.length !== apiKeyIds.length) {
      const missing = _.difference(
        apiKeyIds,
        existingApiKeys.map((x) => x.id),
      );
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_PERMISSION_MISSING_APIKEY', locale), missing });
    }

    let accountIds = access
      .filter((x) => {
        return x.type === 'ACCOUNT' && x.permission !== 'REMOVE';
      })
      .map((x) => x.id);
    accountIds = Array.from(new Set(accountIds));
    const existingAccounts = await dashboardDataSource.getRepository(Account).findBy({ id: Any(accountIds) });
    if (existingAccounts.length !== accountIds.length) {
      const missing = _.difference(
        accountIds,
        existingAccounts.map((x) => x.id),
      );
      throw new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_PERMISSION_MISSING_ACCOUNT', locale), missing });
    }

    dashboardPermission.access = this.modifyPermissions(
      { id: dashboardPermission.owner_id, type: dashboardPermission.owner_type },
      dashboardPermission.access,
      access,
    );
    await dashboardPermissionRepo.save(dashboardPermission);
    const result = await dashboardPermissionRepo.findOneByOrFail({ id });
    return result;
  }

  private modifyPermissions(
    owner: { id: string; type: 'ACCOUNT' | 'APIKEY' },
    existing: PermissionResource[],
    updates: PermissionResource[],
  ): PermissionResource[] {
    const removals = updates.filter((x) => {
      return x.permission === 'REMOVE';
    });
    const additions = updates.filter((x) => {
      return x.permission !== 'REMOVE';
    });
    let result = [...existing];
    const currentAccess: Record<string, number> = {};
    result.forEach((x, index) => {
      currentAccess[`${x.id}-${x.type}`] = index;
    });
    additions.forEach((x) => {
      const index = currentAccess[`${x.id}-${x.type}`];
      if (index !== undefined) {
        result[index].permission = x.permission;
      } else {
        result.push(x);
      }
    });
    result = result.filter((x) => {
      return x.id !== owner.id || x.type !== owner.type;
    });

    return result.filter((x) => {
      return !removals.some((y) => y.id === x.id && y.type === x.type);
    });
  }
}
