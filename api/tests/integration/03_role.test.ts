import { connectionHook } from './jest.util';
import {
  FIXED_ROLE_TYPES,
  PERMISSIONS,
  HIDDEN_PERMISSIONS,
  RoleService,
  FIXED_ROLE_PERMISSIONS,
} from '~/services/role.service';
import { Account as AccountApiModel } from '~/api_models/account';
import Account from '~/models/account';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { ApiKey as ApiKeyApiModel } from '~/api_models/api';
import ApiKey from '~/models/apiKey';
import { ApiError, FORBIDDEN, UNAUTHORIZED } from '~/utils/errors';
import { DEFAULT_LANGUAGE } from '~/utils/constants';
import Role from '~/models/role';

describe('RoleService', () => {
  connectionHook();
  let roleService: RoleService;
  let account: AccountApiModel;
  let apikey: ApiKeyApiModel;

  beforeAll(async () => {
    roleService = new RoleService();
    account = await dashboardDataSource.manager
      .createQueryBuilder(Account, 'account')
      .innerJoin(Role, 'role', 'account.role_id = role.id')
      .select('account.*')
      .addSelect('role.permissions', 'permissions')
      .where('account.name = :name', { name: 'superadmin' })
      .getRawOne<AccountApiModel>();
    apikey = await dashboardDataSource.manager
      .createQueryBuilder(ApiKey, 'api_key')
      .innerJoin(Role, 'role', 'api_key.role_id = role.id')
      .select('api_key.*')
      .addSelect('role.permissions', 'permissions')
      .where('api_key.name = :name', { name: 'apiKey4' })
      .getRawOne<ApiKeyApiModel>();
  });

  it('list', async () => {
    const roles = await roleService.list();
    expect(roles).toMatchObject([
      {
        id: FIXED_ROLE_TYPES.INACTIVE,
        description: 'Disabled user. Can not login',
        permissions: [],
      },
      {
        id: FIXED_ROLE_TYPES.READER,
        description: 'Can view dashboards',
        permissions: FIXED_ROLE_PERMISSIONS.READER,
      },
      {
        id: FIXED_ROLE_TYPES.AUTHOR,
        description: 'Can view and create dashboards',
        permissions: FIXED_ROLE_PERMISSIONS.AUTHOR,
      },
      {
        id: FIXED_ROLE_TYPES.ADMIN,
        description:
          'Can view and create dashboards. Can add and delete datasources. Can add users except other admins',
        permissions: FIXED_ROLE_PERMISSIONS.ADMIN,
      },
      {
        id: FIXED_ROLE_TYPES.SUPERADMIN,
        description: 'Can do everything',
        permissions: FIXED_ROLE_PERMISSIONS.SUPERADMIN,
      },
    ]);
  });

  it('permissions', async () => {
    const permissions = roleService.permissions(DEFAULT_LANGUAGE);
    expect(permissions).toMatchObject([
      {
        key: '[datasource]view',
        description: 'Allows viewing datasources',
      },
      {
        key: '[datasource]manage',
        description: 'Allows creating, editing, deleting datasources',
      },
      {
        key: '[dashboard]view',
        description: 'Allows viewing dashboards (including contents)',
      },
      {
        key: '[dashboard]manage',
        description: 'Allows creating, editing, deleting dashboards, and viewing changelogs',
      },
      { key: '[account]list', description: 'Allows viewing of accounts' },
      { key: '[account]login', description: 'Allows logging in' },
      {
        key: '[account]update',
        description: 'Allows updating own account',
      },
      {
        key: '[account]changepassword',
        description: 'Allows changing account password',
      },
      {
        key: '[account]manage',
        description: 'Allows creating, editing, deleting accounts',
      },
      { key: '[apikey]list', description: 'Allows viewing of ApiKeys' },
      {
        key: '[apikey]manage',
        description: 'Allows creating and deleting ApiKeys',
      },
      {
        key: '[role]manage',
        description: 'Allows creating, editing, deleting roles',
      },
      { key: '[config]set-lang', description: 'Allows updating lang' },
      {
        key: '[config]set-website_settings',
        description: 'Allows updating website settings',
      },
      {
        key: '[config]set-query_cache_enabled',
        description: 'Allows updating the query cache enabled status',
      },
      {
        key: '[config]set-query_cache_expire_time',
        description: 'Allows updating the query cache expire time',
      },
      {
        key: '[customfunction]view',
        description: 'Allows viewing custom functions',
      },
      {
        key: '[customfunction]manage',
        description: 'Allows creating, editing, deleting custom functions',
      },
      {
        key: '[sqlsnippet]view',
        description: 'Allows viewing sql snippets',
      },
      {
        key: '[sqlsnippet]manage',
        description: 'Allows creating, editing, deleting sql snippets',
      },
      {
        key: '[preset]',
        description: 'Allows modification of preset assets',
      },
    ]);
  });

  describe('checkPermission', () => {
    it('should successfully check permission with account', async () => {
      RoleService.checkPermission(
        { match: 'all', permissions: [HIDDEN_PERMISSIONS.PRESET] },
        DEFAULT_LANGUAGE,
        account.permissions,
      );
    });

    it('should successfully check permission with apikey', async () => {
      RoleService.checkPermission(
        { match: 'all', permissions: [PERMISSIONS.DASHBOARD_VIEW] },
        DEFAULT_LANGUAGE,
        apikey.permissions,
      );
    });

    it('should throw if no auth', async () => {
      expect(() => {
        RoleService.checkPermission({ match: 'all', permissions: [PERMISSIONS.DATASOURCE_MANAGE] }, DEFAULT_LANGUAGE);
      }).toThrowError(new ApiError(UNAUTHORIZED, { message: 'Not authenticated' }));
    });

    it('should throw if not enough privileges', async () => {
      expect(() => {
        RoleService.checkPermission(
          { match: 'all', permissions: [PERMISSIONS.DATASOURCE_MANAGE] },
          DEFAULT_LANGUAGE,
          [],
        );
      }).toThrowError(new ApiError(FORBIDDEN, { message: 'Access denied' }));
    });
  });

  describe('createOrUpdate', () => {
    it('should create role', async () => {
      const role = await roleService.createOrUpdate('test', 'test', []);
      expect(role).toMatchObject({
        id: 'test',
        description: 'test',
        permissions: [],
      });
    });

    it('should update role', async () => {
      const role = await roleService.createOrUpdate('test', 'test_updated', ['test']);
      expect(role).toMatchObject({
        id: 'test',
        description: 'test_updated',
        permissions: ['test'],
      });
    });
  });

  describe('delete', () => {
    it('before delete should have 6 roles', async () => {
      const roles = await roleService.list();
      expect(roles).toHaveLength(6);
    });

    it('delete', async () => {
      await roleService.delete('test');
    });

    it('after delete should have 5 roles', async () => {
      const roles = await roleService.list();
      expect(roles).toHaveLength(5);
    });
  });
});
