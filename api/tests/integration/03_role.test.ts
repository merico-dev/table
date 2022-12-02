import { connectionHook } from './jest.util';
import { RoleService } from '~/services/role.service';
import Account from '~/models/account';
import { dashboardDataSource } from '~/data_sources/dashboard';
import ApiKey from '~/models/apiKey';
import { ROLE_TYPES } from '~/api_models/role';
import { ApiError, FORBIDDEN, UNAUTHORIZED } from '~/utils/errors';

describe('RoleService', () => {
  connectionHook();
  let roleService: RoleService;
  let account: Account;
  let apikey: ApiKey;

  beforeAll(async () => {
    roleService = new RoleService();
    account = await dashboardDataSource.manager.findOneBy(Account, { name: 'superadmin' });
    apikey = await dashboardDataSource.manager.findOneBy(ApiKey, { name: 'apiKey4' });
  });

  it('list', async () => {
    const roles = await roleService.list();
    expect(roles).toMatchObject([
      {
        id: 10,
        name: 'INACTIVE',
        description: 'Disabled user. Can not login'
      },
      { 
        id: 20, 
        name: 'READER', 
        description: 'Can view dashboards' 
      },
      {
        id: 30,
        name: 'AUTHOR',
        description: 'Can view and create dashboards'
      },
      {
        id: 40,
        name: 'ADMIN',
        description: 'Can view and create dashboards. Can add and delete datasources. Can add users except other admins'
      },
      { 
        id: 50, 
        name: 'SUPERADMIN', 
        description: 'Can do everything' 
      }
    ])
  });

  describe('checkPermission', () => {
    it('should successfully check permission with account', async () => {
      RoleService.checkPermission(account, ROLE_TYPES.INACTIVE);
    });

    it('should successfully check permission with apikey', async () => {
      RoleService.checkPermission(apikey, ROLE_TYPES.INACTIVE);
    });

    it('should throw if no auth', async () => {
      expect(() => {
        RoleService.checkPermission(null, ROLE_TYPES.INACTIVE);
      }).toThrowError(new ApiError(UNAUTHORIZED, { message: 'Not authenticated' }));
    });

    it('should throw if not enough privileges', async () => {
      expect(() => {
        RoleService.checkPermission(apikey, ROLE_TYPES.SUPERADMIN);
      }).toThrowError(new ApiError(FORBIDDEN, { message: 'Insufficient privileges' }));
    });
  });
});