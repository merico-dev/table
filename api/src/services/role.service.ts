import Role from '../models/role';
import { dashboardDataSource } from '../data_sources/dashboard';
import { ApiError, BAD_REQUEST, FORBIDDEN, UNAUTHORIZED } from '../utils/errors';
import { AUTH_ENABLED } from '../utils/constants';
import { ROLE_PERMISSION_KEYS, translate } from '../utils/i18n';
import { RolePermission } from '../api_models/role';
import { injectable } from 'inversify';

export enum FIXED_ROLE_TYPES {
  INACTIVE = 'INACTIVE',
  READER = 'READER',
  AUTHOR = 'AUTHOR',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export enum PERMISSIONS {
  DATASOURCE_VIEW = '[datasource]view',
  DATASOURCE_MANAGE = '[datasource]manage',
  DASHBOARD_VIEW = '[dashboard]view',
  DASHBOARD_MANAGE = '[dashboard]manage',
  ACCOUNT_LIST = '[account]list',
  ACCOUNT_LOGIN = '[account]login',
  ACCOUNT_UPDATE = '[account]update',
  ACCOUNT_CHANGEPASSWORD = '[account]changepassword',
  ACCOUNT_MANAGE = '[account]manage',
  APIKEY_LIST = '[apikey]list',
  APIKEY_MANAGE = '[apikey]manage',
  ROLE_MANAGE = '[role]manage',
  CONFIG_SET_LANG = '[config]set-lang',
  CONFIG_SET_WEBSITE_SETTINGS = '[config]set-website_settings',
  CONFIG_SET_QUERY_CACHE_ENABLED = '[config]set-query_cache_enabled',
  CONFIG_SET_QUERY_CACHE_EXPIRE_TIME = '[config]set-query_cache_expire_time',
  CUSTOM_FUNCTION_VIEW = '[customfunction]view',
  CUSTOM_FUNCTION_MANAGE = '[customfunction]manage',
  SQL_SNIPPET_VIEW = '[sqlsnippet]view',
  SQL_SNIPPET_MANAGE = '[sqlsnippet]manage',
}

export enum HIDDEN_PERMISSIONS {
  PRESET = '[preset]',
}

export type CHECK_PERMISSION = {
  match: 'any' | 'all';
  permissions: (PERMISSIONS | HIDDEN_PERMISSIONS)[];
};

export const FIXED_ROLE_PERMISSIONS = {
  [FIXED_ROLE_TYPES.INACTIVE]: [],
  [FIXED_ROLE_TYPES.READER]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.ACCOUNT_LOGIN,
    PERMISSIONS.ACCOUNT_UPDATE,
    PERMISSIONS.ACCOUNT_CHANGEPASSWORD,
    PERMISSIONS.CONFIG_SET_LANG,
    PERMISSIONS.CUSTOM_FUNCTION_VIEW,
    PERMISSIONS.SQL_SNIPPET_VIEW,
  ],
  [FIXED_ROLE_TYPES.AUTHOR]: [
    PERMISSIONS.DATASOURCE_VIEW,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_MANAGE,
    PERMISSIONS.ACCOUNT_LOGIN,
    PERMISSIONS.ACCOUNT_LIST,
    PERMISSIONS.ACCOUNT_UPDATE,
    PERMISSIONS.ACCOUNT_CHANGEPASSWORD,
    PERMISSIONS.APIKEY_LIST,
    PERMISSIONS.CONFIG_SET_LANG,
    PERMISSIONS.CUSTOM_FUNCTION_VIEW,
    PERMISSIONS.SQL_SNIPPET_VIEW,
  ],
  [FIXED_ROLE_TYPES.ADMIN]: [
    PERMISSIONS.DATASOURCE_VIEW,
    PERMISSIONS.DATASOURCE_MANAGE,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_MANAGE,
    PERMISSIONS.ACCOUNT_LOGIN,
    PERMISSIONS.ACCOUNT_LIST,
    PERMISSIONS.ACCOUNT_UPDATE,
    PERMISSIONS.ACCOUNT_CHANGEPASSWORD,
    PERMISSIONS.ACCOUNT_MANAGE,
    PERMISSIONS.APIKEY_LIST,
    PERMISSIONS.APIKEY_MANAGE,
    PERMISSIONS.CONFIG_SET_LANG,
    PERMISSIONS.CONFIG_SET_WEBSITE_SETTINGS,
    PERMISSIONS.CONFIG_SET_QUERY_CACHE_ENABLED,
    PERMISSIONS.CONFIG_SET_QUERY_CACHE_EXPIRE_TIME,
    PERMISSIONS.ROLE_MANAGE,
    PERMISSIONS.CUSTOM_FUNCTION_VIEW,
    PERMISSIONS.CUSTOM_FUNCTION_MANAGE,
    PERMISSIONS.SQL_SNIPPET_VIEW,
    PERMISSIONS.SQL_SNIPPET_MANAGE,
  ],
  [FIXED_ROLE_TYPES.SUPERADMIN]: [
    PERMISSIONS.DATASOURCE_VIEW,
    PERMISSIONS.DATASOURCE_MANAGE,
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_MANAGE,
    PERMISSIONS.ACCOUNT_LOGIN,
    PERMISSIONS.ACCOUNT_LIST,
    PERMISSIONS.ACCOUNT_UPDATE,
    PERMISSIONS.ACCOUNT_CHANGEPASSWORD,
    PERMISSIONS.ACCOUNT_MANAGE,
    PERMISSIONS.APIKEY_LIST,
    PERMISSIONS.APIKEY_MANAGE,
    PERMISSIONS.CONFIG_SET_LANG,
    PERMISSIONS.CONFIG_SET_WEBSITE_SETTINGS,
    PERMISSIONS.CONFIG_SET_QUERY_CACHE_ENABLED,
    PERMISSIONS.CONFIG_SET_QUERY_CACHE_EXPIRE_TIME,
    PERMISSIONS.ROLE_MANAGE,
    PERMISSIONS.CUSTOM_FUNCTION_VIEW,
    PERMISSIONS.CUSTOM_FUNCTION_MANAGE,
    PERMISSIONS.SQL_SNIPPET_VIEW,
    PERMISSIONS.SQL_SNIPPET_MANAGE,
    HIDDEN_PERMISSIONS.PRESET,
  ],
};

@injectable()
export class RoleService {
  static async ensureFixedRolePermissions(): Promise<void> {
    const roleRepo = dashboardDataSource.getRepository(Role);
    for (const [role, permissions] of Object.entries(FIXED_ROLE_PERMISSIONS)) {
      const roleEntity = await roleRepo.findOne({ where: { id: role } });
      if (roleEntity) {
        roleEntity.permissions = permissions;
        await roleRepo.save(roleEntity);
      }
    }
  }

  static checkPermission(requiredPermission: CHECK_PERMISSION, locale: string, permissions?: string[]): void {
    if (!AUTH_ENABLED) {
      return;
    }
    if (!permissions) {
      throw new ApiError(UNAUTHORIZED, { message: translate('UNAUTHORIZED', locale) });
    }
    const permissionsSet = new Set(permissions);
    let is_valid = true;
    switch (requiredPermission.match) {
      case 'any':
        if (!requiredPermission.permissions.some((permission) => permissionsSet.has(permission))) is_valid = false;
        break;
      case 'all':
        if (!requiredPermission.permissions.every((permission) => permissionsSet.has(permission))) is_valid = false;
        break;
      default:
        break;
    }
    if (!is_valid) {
      throw new ApiError(FORBIDDEN, { message: translate('FORBIDDEN', locale) });
    }
  }

  async list(): Promise<Role[]> {
    const roleRepo = dashboardDataSource.getRepository(Role);
    return await roleRepo.find();
  }

  permissions(locale: string): RolePermission[] {
    return [...Object.entries(PERMISSIONS), ...Object.entries(HIDDEN_PERMISSIONS)].map(([key, permission]) => {
      const lang_key = `ROLE_PERMISSION_${key}` as ROLE_PERMISSION_KEYS;
      return { key: permission, description: translate(lang_key, locale) };
    });
  }

  async create(id: string, description: string, permissions: string[], locale: string): Promise<Role> {
    const roleRepo = dashboardDataSource.getRepository(Role);
    if (await roleRepo.exist({ where: { id } })) {
      throw new ApiError(BAD_REQUEST, { message: translate('ROLE_ALREADY_EXISTS', locale) });
    }
    const role = new Role();
    role.id = id;
    role.description = description;
    role.permissions = permissions;
    return await roleRepo.save(role);
  }

  async update(id: string, description: string, permissions: string[]): Promise<Role> {
    const roleRepo = dashboardDataSource.getRepository(Role);
    const role = await roleRepo.findOneByOrFail({ id });
    role.description = description;
    role.permissions = permissions;
    return await roleRepo.save(role);
  }

  async delete(id: string): Promise<void> {
    const roleRepo = dashboardDataSource.getRepository(Role);
    await roleRepo.delete(id);
  }
}
