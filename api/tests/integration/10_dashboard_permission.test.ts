import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { connectionHook, sleep } from './jest.util';
import { DashboardPermissionService } from '~/services/dashboard_permission.service';
import { AccountService } from '~/services/account.service';
import { ApiService } from '~/services/api.service';
import { DashboardService } from '~/services/dashboard.service';
import Dashboard from '~/models/dashboard';
import { ROLE_TYPES } from '~/api_models/role';
import { DEFAULT_LANGUAGE, SALT_ROUNDS } from '~/utils/constants';
import Account from '~/models/account';
import { dashboardDataSource } from '~/data_sources/dashboard';
import ApiKey from '~/models/apiKey';
import { ApiError, BAD_REQUEST, FORBIDDEN } from '~/utils/errors';
import { translate } from '~/utils/i18n';
import { omitTime } from '~/utils/helpers';

describe('DashboardPermissionService', () => {
  connectionHook();
  let accountService: AccountService;
  let apiService: ApiService;
  let dashboardService: DashboardService;
  let dashboardPermissionService: DashboardPermissionService;

  let account: Account;
  let readerAccount: Account;
  let adminAccount: Account;
  let apiKey: ApiKey;
  let accountDashboard: Dashboard;
  let apiKeyDashboard: Dashboard;

  let noOwnerDashboardId: string;

  beforeAll(async () => {
    dashboardPermissionService = new DashboardPermissionService();
    accountService = new AccountService();
    apiService = new ApiService();
    dashboardService = new DashboardService();

    const accountData = new Account();
    accountData.name = 'dashboard_permission';
    accountData.email = 'dashboard@permission.test';
    accountData.password = await bcrypt.hash(accountData.name, SALT_ROUNDS);
    accountData.role_id = ROLE_TYPES.AUTHOR;
    account = await dashboardDataSource.getRepository(Account).save(accountData);

    const adminAccountData = new Account();
    adminAccountData.name = 'admin_dashboard_permission';
    adminAccountData.email = 'admin_dashboard@permission.test';
    adminAccountData.password = await bcrypt.hash(adminAccountData.name, SALT_ROUNDS);
    adminAccountData.role_id = ROLE_TYPES.ADMIN;
    adminAccount = await dashboardDataSource.getRepository(Account).save(adminAccountData);

    const readerAccountData = new Account();
    readerAccountData.name = 'reader_dashboard_permission';
    readerAccountData.email = 'reader_dashboard@permission.test';
    readerAccountData.password = await bcrypt.hash(readerAccountData.name, SALT_ROUNDS);
    readerAccountData.role_id = ROLE_TYPES.READER;
    readerAccount = await dashboardDataSource.getRepository(Account).save(readerAccountData);

    const apiKeyData = new ApiKey();
    apiKeyData.name = 'dashboard_permission';
    apiKeyData.app_id = crypto.randomBytes(8).toString('hex');
    apiKeyData.app_secret = crypto.randomBytes(16).toString('hex');
    apiKeyData.role_id = ROLE_TYPES.AUTHOR;
    apiKey = await dashboardDataSource.getRepository(ApiKey).save(apiKeyData);

    accountDashboard = await dashboardService.create(
      'accountDashboard',
      'dashboard_permission',
      DEFAULT_LANGUAGE,
      account,
    );

    apiKeyDashboard = await dashboardService.create(
      'apiKeyDashboard',
      'dashboard_permission',
      DEFAULT_LANGUAGE,
      apiKey,
    );
  });

  describe('list 1', () => {
    it('no filters', async () => {
      const results = await dashboardPermissionService.list(undefined, [{ field: 'create_time', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      });
      results.data = results.data.map(omitTime);
      expect(results).toMatchObject({
        total: 5,
        offset: 0,
        data: [
          {
            id: results.data[0].id,
            owner_id: results.data[0].owner_id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: results.data[1].id,
            owner_id: results.data[1].owner_id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: results.data[2].id,
            owner_id: null,
            owner_type: null,
            access: [],
          },
          {
            id: results.data[3].id,
            owner_id: account.id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: results.data[4].id,
            owner_id: apiKey.id,
            owner_type: 'APIKEY',
            access: [],
          },
        ],
      });

      noOwnerDashboardId = results.data[2].id;
    });

    it('with filters', async () => {
      const results1 = await dashboardPermissionService.list(
        { id: { isFuzzy: true, value: noOwnerDashboardId } },
        [{ field: 'create_time', order: 'ASC' }],
        {
          page: 1,
          pagesize: 20,
        },
      );
      results1.data = results1.data.map(omitTime);
      expect(results1).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: results1.data[0].id,
            owner_id: null,
            owner_type: null,
            access: [],
          },
        ],
      });

      const results2 = await dashboardPermissionService.list(
        { owner_id: { isFuzzy: true, value: apiKey.id } },
        [{ field: 'create_time', order: 'ASC' }],
        {
          page: 1,
          pagesize: 20,
        },
      );

      results2.data = results2.data.map(omitTime);
      expect(results2).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: results2.data[0].id,
            owner_id: apiKey.id,
            owner_type: 'APIKEY',
            access: [],
          },
        ],
      });

      const results3 = await dashboardPermissionService.list(
        { owner_type: { isFuzzy: true, value: 'A' } },
        [{ field: 'create_time', order: 'ASC' }],
        { page: 1, pagesize: 20 },
      );
      results3.data = results3.data.map(omitTime);
      expect(results3).toMatchObject({
        total: 4,
        offset: 0,
        data: [
          {
            id: results3.data[0].id,
            owner_id: results3.data[0].owner_id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: results3.data[1].id,
            owner_id: results3.data[1].owner_id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: accountDashboard.id,
            owner_id: account.id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: apiKeyDashboard.id,
            owner_id: apiKey.id,
            owner_type: 'APIKEY',
            access: [],
          },
        ],
      });
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const result1 = await dashboardPermissionService.update(
        accountDashboard.id,
        [{ id: apiKey.id, type: 'APIKEY', permission: 'VIEW' }],
        account,
        DEFAULT_LANGUAGE,
      );
      expect(omitTime(result1)).toMatchObject({
        id: accountDashboard.id,
        owner_id: account.id,
        owner_type: 'ACCOUNT',
        access: [{ id: apiKey.id, type: 'APIKEY', permission: 'VIEW' }],
      });

      const result2 = await dashboardPermissionService.update(
        accountDashboard.id,
        [{ id: apiKey.id, type: 'APIKEY', permission: 'REMOVE' }],
        account,
        DEFAULT_LANGUAGE,
      );
      expect(omitTime(result2)).toMatchObject({
        id: accountDashboard.id,
        owner_id: account.id,
        owner_type: 'ACCOUNT',
        access: [],
      });
    });

    it('adding owner to access should not add', async () => {
      const result = await dashboardPermissionService.update(
        apiKeyDashboard.id,
        [{ id: apiKey.id, type: 'APIKEY', permission: 'VIEW' }],
        apiKey,
        DEFAULT_LANGUAGE,
      );
      expect(omitTime(result)).toMatchObject({
        id: apiKeyDashboard.id,
        owner_id: apiKey.id,
        owner_type: 'APIKEY',
        access: [],
      });
    });

    it('modify other owner dashboard permission should fail if not admin', async () => {
      await expect(
        dashboardPermissionService.update(
          accountDashboard.id,
          [{ id: apiKey.id, type: 'APIKEY', permission: 'EDIT' }],
          apiKey,
          DEFAULT_LANGUAGE,
        ),
      ).rejects.toThrowError(
        new ApiError(FORBIDDEN, { message: translate('DASHBOARD_PERMISSION_FORBIDDEN', DEFAULT_LANGUAGE) }),
      );

      const result = await dashboardPermissionService.update(
        accountDashboard.id,
        [{ id: adminAccount.id, type: 'ACCOUNT', permission: 'EDIT' }],
        adminAccount,
        DEFAULT_LANGUAGE,
      );
      expect(omitTime(result)).toMatchObject({
        id: accountDashboard.id,
        owner_id: account.id,
        owner_type: 'ACCOUNT',
        access: [{ id: adminAccount.id, type: 'ACCOUNT', permission: 'EDIT' }],
      });
    });

    it('should fail if no owner', async () => {
      await expect(
        dashboardPermissionService.update(noOwnerDashboardId, [], adminAccount, DEFAULT_LANGUAGE),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_PERMISSION_NO_OWNER', DEFAULT_LANGUAGE) }),
      );
    });
  });

  describe('updateOwner', () => {
    it('should update successfully', async () => {
      const result1 = await dashboardPermissionService.updateOwner(
        noOwnerDashboardId,
        account.id,
        'ACCOUNT',
        adminAccount,
        DEFAULT_LANGUAGE,
      );
      expect(omitTime(result1)).toMatchObject({
        id: noOwnerDashboardId,
        owner_id: account.id,
        owner_type: 'ACCOUNT',
        access: [],
      });
      const result2 = await dashboardPermissionService.updateOwner(
        accountDashboard.id,
        adminAccount.id,
        'ACCOUNT',
        adminAccount,
        DEFAULT_LANGUAGE,
      );
      expect(omitTime(result2)).toMatchObject({
        id: accountDashboard.id,
        owner_id: adminAccount.id,
        owner_type: 'ACCOUNT',
        access: [],
      });
    });

    it('should fail if not owner or admin', async () => {
      await expect(
        dashboardPermissionService.updateOwner(accountDashboard.id, apiKey.id, 'APIKEY', apiKey, DEFAULT_LANGUAGE),
      ).rejects.toThrowError(
        new ApiError(FORBIDDEN, { message: translate('DASHBOARD_PERMISSION_FORBIDDEN', DEFAULT_LANGUAGE) }),
      );
    });

    it('should fail if new owner has insufficient privileges', async () => {
      await expect(
        dashboardPermissionService.updateOwner(
          accountDashboard.id,
          readerAccount.id,
          'ACCOUNT',
          adminAccount,
          DEFAULT_LANGUAGE,
        ),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_OWNER_INSUFFICIENT_PRIVILEGES', DEFAULT_LANGUAGE) }),
      );
    });
  });

  describe('deleting account/apikey/dashboard', () => {
    it('deleting account should update all affected dashboard permissions', async () => {
      await accountService.delete(account.id, ROLE_TYPES.SUPERADMIN, DEFAULT_LANGUAGE);
      await sleep(2000);
      await accountService.delete(readerAccount.id, ROLE_TYPES.SUPERADMIN, DEFAULT_LANGUAGE);
      await sleep(2000);
      await accountService.delete(adminAccount.id, ROLE_TYPES.SUPERADMIN, DEFAULT_LANGUAGE);
      await sleep(2000);

      const result = await dashboardPermissionService.list(undefined, [{ field: 'create_time', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      });
      result.data = result.data.map(omitTime);
      expect(result).toMatchObject({
        total: 5,
        offset: 0,
        data: [
          {
            id: result.data[0].id,
            owner_id: result.data[0].owner_id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: result.data[1].id,
            owner_id: result.data[1].owner_id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: result.data[2].id,
            owner_id: null,
            owner_type: null,
            access: [],
          },
          {
            id: result.data[3].id,
            owner_id: null,
            owner_type: null,
            access: [],
          },
          {
            id: result.data[4].id,
            owner_id: result.data[4].owner_id,
            owner_type: 'APIKEY',
            access: [],
          },
        ],
      });
    });

    it('deleting apikey should update all affected dashboard permissions', async () => {
      await apiService.deleteKey(apiKey.id, DEFAULT_LANGUAGE);
      await sleep(2000);

      const result = await dashboardPermissionService.list(undefined, [{ field: 'create_time', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      });
      result.data = result.data.map(omitTime);
      expect(result).toMatchObject({
        total: 5,
        offset: 0,
        data: [
          {
            id: result.data[0].id,
            owner_id: result.data[0].owner_id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: result.data[1].id,
            owner_id: result.data[1].owner_id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: result.data[2].id,
            owner_id: null,
            owner_type: null,
            access: [],
          },
          {
            id: result.data[3].id,
            owner_id: null,
            owner_type: null,
            access: [],
          },
          {
            id: result.data[4].id,
            owner_id: null,
            owner_type: null,
            access: [],
          },
        ],
      });
    });

    it('deleting dashboard should remove dashboard permission', async () => {
      await dashboardDataSource.getRepository(Dashboard).delete(accountDashboard.id);
      await dashboardDataSource.getRepository(Dashboard).delete(apiKeyDashboard.id);

      const result = await dashboardPermissionService.list(undefined, [{ field: 'create_time', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      });
      result.data = result.data.map(omitTime);
      expect(result).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: result.data[0].id,
            owner_id: result.data[0].owner_id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: result.data[1].id,
            owner_id: result.data[1].owner_id,
            owner_type: 'ACCOUNT',
            access: [],
          },
          {
            id: result.data[2].id,
            owner_id: null,
            owner_type: null,
            access: [],
          },
        ],
      });
    });
  });
});
