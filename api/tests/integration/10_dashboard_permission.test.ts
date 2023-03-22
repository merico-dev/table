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
      {},
      'dashboard_permission',
      DEFAULT_LANGUAGE,
      account,
    );

    apiKeyDashboard = await dashboardService.create(
      'apiKeyDashboard',
      {},
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
      expect(results).toMatchObject({
        total: 5,
        offset: 0,
        data: [
          {
            id: results.data[0].id,
            dashboard_id: results.data[0].dashboard_id,
            owner_id: results.data[0].owner_id,
            owner_type: 'ACCOUNT',
            can_view: [],
            can_edit: [],
            create_time: results.data[0].create_time,
            update_time: results.data[0].update_time,
          },
          {
            id: results.data[1].id,
            dashboard_id: results.data[1].dashboard_id,
            owner_id: results.data[1].owner_id,
            owner_type: 'ACCOUNT',
            can_view: [],
            can_edit: [],
            create_time: results.data[1].create_time,
            update_time: results.data[1].update_time,
          },
          {
            id: results.data[2].id,
            dashboard_id: results.data[2].dashboard_id,
            owner_id: null,
            owner_type: null,
            can_view: [],
            can_edit: [],
            create_time: results.data[2].create_time,
            update_time: results.data[2].update_time,
          },
          {
            id: results.data[3].id,
            dashboard_id: accountDashboard.id,
            owner_id: account.id,
            owner_type: 'ACCOUNT',
            can_view: [],
            can_edit: [],
            create_time: results.data[3].create_time,
            update_time: results.data[3].update_time,
          },
          {
            id: results.data[4].id,
            dashboard_id: apiKeyDashboard.id,
            owner_id: apiKey.id,
            owner_type: 'APIKEY',
            can_view: [],
            can_edit: [],
            create_time: results.data[4].create_time,
            update_time: results.data[4].update_time,
          },
        ],
      });

      noOwnerDashboardId = results.data[2].dashboard_id;
    });

    it('with filters', async () => {
      const results1 = await dashboardPermissionService.list(
        { dashboard_id: { isFuzzy: true, value: noOwnerDashboardId } },
        [{ field: 'create_time', order: 'ASC' }],
        {
          page: 1,
          pagesize: 20,
        },
      );
      expect(results1).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: results1.data[0].id,
            dashboard_id: results1.data[0].dashboard_id,
            owner_id: null,
            owner_type: null,
            can_view: [],
            can_edit: [],
            create_time: results1.data[0].create_time,
            update_time: results1.data[0].update_time,
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

      expect(results2).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: results2.data[0].id,
            dashboard_id: results2.data[0].dashboard_id,
            owner_id: apiKey.id,
            owner_type: 'APIKEY',
            can_view: [],
            can_edit: [],
            create_time: results2.data[0].create_time,
            update_time: results2.data[0].update_time,
          },
        ],
      });

      const result3 = await dashboardPermissionService.list(
        { owner_type: { isFuzzy: true, value: 'A' } },
        [{ field: 'create_time', order: 'ASC' }],
        { page: 1, pagesize: 20 },
      );
      expect(result3).toMatchObject({
        total: 4,
        offset: 0,
        data: [
          {
            id: result3.data[0].id,
            dashboard_id: result3.data[0].dashboard_id,
            owner_id: result3.data[0].owner_id,
            owner_type: 'ACCOUNT',
            can_view: [],
            can_edit: [],
            create_time: result3.data[0].create_time,
            update_time: result3.data[0].update_time,
          },
          {
            id: result3.data[1].id,
            dashboard_id: result3.data[1].dashboard_id,
            owner_id: result3.data[1].owner_id,
            owner_type: 'ACCOUNT',
            can_view: [],
            can_edit: [],
            create_time: result3.data[1].create_time,
            update_time: result3.data[1].update_time,
          },
          {
            id: result3.data[2].id,
            dashboard_id: accountDashboard.id,
            owner_id: account.id,
            owner_type: 'ACCOUNT',
            can_view: [],
            can_edit: [],
            create_time: result3.data[2].create_time,
            update_time: result3.data[2].update_time,
          },
          {
            id: result3.data[3].id,
            dashboard_id: apiKeyDashboard.id,
            owner_id: apiKey.id,
            owner_type: 'APIKEY',
            can_view: [],
            can_edit: [],
            create_time: result3.data[3].create_time,
            update_time: result3.data[3].update_time,
          },
        ],
      });
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const result1 = await dashboardPermissionService.update(
        accountDashboard.id,
        'ADD',
        [{ id: apiKey.id, type: 'APIKEY' }],
        [{ id: apiKey.id, type: 'APIKEY' }],
        account,
        DEFAULT_LANGUAGE,
      );
      expect(result1).toMatchObject({
        id: result1.id,
        create_time: result1.create_time,
        update_time: result1.update_time,
        dashboard_id: accountDashboard.id,
        owner_id: account.id,
        owner_type: 'ACCOUNT',
        can_view: [{ id: apiKey.id, type: 'APIKEY' }],
        can_edit: [{ id: apiKey.id, type: 'APIKEY' }],
      });

      const result2 = await dashboardPermissionService.update(
        accountDashboard.id,
        'REMOVE',
        [],
        [{ id: apiKey.id, type: 'APIKEY' }],
        account,
        DEFAULT_LANGUAGE,
      );
      expect(result2).toMatchObject({
        id: result2.id,
        create_time: result2.create_time,
        update_time: result2.update_time,
        dashboard_id: accountDashboard.id,
        owner_id: account.id,
        owner_type: 'ACCOUNT',
        can_view: [{ id: apiKey.id, type: 'APIKEY' }],
        can_edit: [],
      });
    });

    it('adding owner to can_view/can_edit should not add', async () => {
      const result = await dashboardPermissionService.update(
        apiKeyDashboard.id,
        'ADD',
        [{ id: apiKey.id, type: 'APIKEY' }],
        [{ id: apiKey.id, type: 'APIKEY' }],
        apiKey,
        DEFAULT_LANGUAGE,
      );
      expect(result).toMatchObject({
        id: result.id,
        create_time: result.create_time,
        update_time: result.update_time,
        dashboard_id: apiKeyDashboard.id,
        owner_id: apiKey.id,
        owner_type: 'APIKEY',
        can_view: [],
        can_edit: [],
      });
    });

    it('modify other owner dashboard permission should fail if not admin', async () => {
      expect(
        dashboardPermissionService.update(
          accountDashboard.id,
          'ADD',
          [{ id: apiKey.id, type: 'APIKEY' }],
          [{ id: apiKey.id, type: 'APIKEY' }],
          apiKey,
          DEFAULT_LANGUAGE,
        ),
      ).rejects.toThrowError(
        new ApiError(FORBIDDEN, { message: translate('DASHBOARD_PERMISSION_FORBIDDEN', DEFAULT_LANGUAGE) }),
      );

      const result = await dashboardPermissionService.update(
        accountDashboard.id,
        'ADD',
        [{ id: adminAccount.id, type: 'ACCOUNT' }],
        [{ id: adminAccount.id, type: 'ACCOUNT' }],
        adminAccount,
        DEFAULT_LANGUAGE,
      );
      expect(result).toMatchObject({
        id: result.id,
        create_time: result.create_time,
        update_time: result.update_time,
        dashboard_id: accountDashboard.id,
        owner_id: account.id,
        owner_type: 'ACCOUNT',
        can_view: [
          { id: apiKey.id, type: 'APIKEY' },
          { id: adminAccount.id, type: 'ACCOUNT' },
        ],
        can_edit: [{ id: adminAccount.id, type: 'ACCOUNT' }],
      });
    });

    it('should fail if no owner', async () => {
      expect(
        dashboardPermissionService.update(noOwnerDashboardId, 'ADD', [], [], adminAccount, DEFAULT_LANGUAGE),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: translate('DASHBOARD_PERMISSION_NO_OWNER', DEFAULT_LANGUAGE) }),
      );
    });
  });

  describe('checkPermission', () => {
    it('should have access', async () => {
      expect(
        DashboardPermissionService.checkPermission(
          accountDashboard.id,
          'VIEW',
          false,
          DEFAULT_LANGUAGE,
          'APIKEY',
          apiKey.id,
        ),
      ).resolves;

      expect(
        DashboardPermissionService.checkPermission(
          accountDashboard.id,
          'VIEW',
          true,
          DEFAULT_LANGUAGE,
          'ACCOUNT',
          adminAccount.id,
        ),
      ).resolves;

      expect(
        DashboardPermissionService.checkPermission(
          accountDashboard.id,
          'VIEW',
          false,
          DEFAULT_LANGUAGE,
          'ACCOUNT',
          account.id,
        ),
      ).resolves;

      expect(
        DashboardPermissionService.checkPermission(
          accountDashboard.id,
          'EDIT',
          true,
          DEFAULT_LANGUAGE,
          'ACCOUNT',
          adminAccount.id,
        ),
      ).resolves;

      expect(
        DashboardPermissionService.checkPermission(
          accountDashboard.id,
          'EDIT',
          true,
          DEFAULT_LANGUAGE,
          'ACCOUNT',
          account.id,
        ),
      ).resolves;

      expect(
        DashboardPermissionService.checkPermission(
          noOwnerDashboardId,
          'VIEW',
          false,
          DEFAULT_LANGUAGE,
          'APIKEY',
          apiKey.id,
        ),
      ).resolves;

      expect(
        DashboardPermissionService.checkPermission(
          noOwnerDashboardId,
          'EDIT',
          false,
          DEFAULT_LANGUAGE,
          'APIKEY',
          apiKey.id,
        ),
      ).resolves;

      expect(
        DashboardPermissionService.checkPermission(
          noOwnerDashboardId,
          'VIEW',
          false,
          DEFAULT_LANGUAGE,
          'ACCOUNT',
          account.id,
        ),
      ).resolves;

      expect(
        DashboardPermissionService.checkPermission(
          noOwnerDashboardId,
          'EDIT',
          false,
          DEFAULT_LANGUAGE,
          'ACCOUNT',
          account.id,
        ),
      ).resolves;

      expect(
        DashboardPermissionService.checkPermission(
          noOwnerDashboardId,
          'VIEW',
          false,
          DEFAULT_LANGUAGE,
          'ACCOUNT',
          adminAccount.id,
        ),
      ).resolves;

      expect(
        DashboardPermissionService.checkPermission(
          noOwnerDashboardId,
          'EDIT',
          false,
          DEFAULT_LANGUAGE,
          'ACCOUNT',
          adminAccount.id,
        ),
      ).resolves;

      expect(
        DashboardPermissionService.checkPermission(
          noOwnerDashboardId,
          'VIEW',
          false,
          DEFAULT_LANGUAGE,
          'ACCOUNT',
          readerAccount.id,
        ),
      ).resolves;
    });

    it('should fail', async () => {
      expect(
        DashboardPermissionService.checkPermission(
          accountDashboard.id,
          'VIEW',
          false,
          DEFAULT_LANGUAGE,
          'ACCOUNT',
          readerAccount.id,
        ),
      ).rejects.toThrowError(
        new ApiError(FORBIDDEN, { message: translate('DASHBOARD_PERMISSION_FORBIDDEN', DEFAULT_LANGUAGE) }),
      );

      expect(
        DashboardPermissionService.checkPermission(
          accountDashboard.id,
          'EDIT',
          false,
          DEFAULT_LANGUAGE,
          'APIKEY',
          apiKey.id,
        ),
      ).rejects.toThrowError(
        new ApiError(FORBIDDEN, { message: translate('DASHBOARD_PERMISSION_FORBIDDEN', DEFAULT_LANGUAGE) }),
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
      expect(result1).toMatchObject({
        id: result1.id,
        create_time: result1.create_time,
        update_time: result1.update_time,
        dashboard_id: noOwnerDashboardId,
        owner_id: account.id,
        owner_type: 'ACCOUNT',
        can_view: [],
        can_edit: [],
      });

      const result2 = await dashboardPermissionService.updateOwner(
        accountDashboard.id,
        adminAccount.id,
        'ACCOUNT',
        account,
        DEFAULT_LANGUAGE,
      );
      expect(result2).toMatchObject({
        id: result2.id,
        create_time: result2.create_time,
        update_time: result2.update_time,
        dashboard_id: accountDashboard.id,
        owner_id: adminAccount.id,
        owner_type: 'ACCOUNT',
        can_view: [{ id: apiKey.id, type: 'APIKEY' }],
        can_edit: [],
      });
    });

    it('should fail if not owner or admin', async () => {
      expect(
        dashboardPermissionService.updateOwner(accountDashboard.id, apiKey.id, 'APIKEY', apiKey, DEFAULT_LANGUAGE),
      ).rejects.toThrowError(
        new ApiError(FORBIDDEN, { message: translate('DASHBOARD_PERMISSION_FORBIDDEN', DEFAULT_LANGUAGE) }),
      );
    });

    it('should fail if new owner has insufficient privileges', async () => {
      expect(
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
      expect(result).toMatchObject({
        total: 5,
        offset: 0,
        data: [
          {
            id: result.data[0].id,
            dashboard_id: result.data[0].dashboard_id,
            owner_id: result.data[0].owner_id,
            owner_type: 'ACCOUNT',
            can_view: [],
            can_edit: [],
            create_time: result.data[0].create_time,
            update_time: result.data[0].update_time,
          },
          {
            id: result.data[1].id,
            dashboard_id: result.data[1].dashboard_id,
            owner_id: result.data[1].owner_id,
            owner_type: 'ACCOUNT',
            can_view: [],
            can_edit: [],
            create_time: result.data[1].create_time,
            update_time: result.data[1].update_time,
          },
          {
            id: result.data[2].id,
            dashboard_id: result.data[2].dashboard_id,
            owner_id: null,
            owner_type: null,
            can_view: [],
            can_edit: [],
            create_time: result.data[2].create_time,
            update_time: result.data[2].update_time,
          },
          {
            id: result.data[3].id,
            dashboard_id: result.data[3].dashboard_id,
            owner_id: null,
            owner_type: null,
            can_view: [{ type: 'APIKEY', id: apiKey.id }],
            can_edit: [],
            create_time: result.data[3].create_time,
            update_time: result.data[3].update_time,
          },
          {
            id: result.data[4].id,
            dashboard_id: result.data[4].dashboard_id,
            owner_id: result.data[4].owner_id,
            owner_type: 'APIKEY',
            can_view: [],
            can_edit: [],
            create_time: result.data[4].create_time,
            update_time: result.data[4].update_time,
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
      expect(result).toMatchObject({
        total: 5,
        offset: 0,
        data: [
          {
            id: result.data[0].id,
            dashboard_id: result.data[0].dashboard_id,
            owner_id: result.data[0].owner_id,
            owner_type: 'ACCOUNT',
            can_view: [],
            can_edit: [],
            create_time: result.data[0].create_time,
            update_time: result.data[0].update_time,
          },
          {
            id: result.data[1].id,
            dashboard_id: result.data[1].dashboard_id,
            owner_id: result.data[1].owner_id,
            owner_type: 'ACCOUNT',
            can_view: [],
            can_edit: [],
            create_time: result.data[1].create_time,
            update_time: result.data[1].update_time,
          },
          {
            id: result.data[2].id,
            dashboard_id: result.data[2].dashboard_id,
            owner_id: null,
            owner_type: null,
            can_view: [],
            can_edit: [],
            create_time: result.data[2].create_time,
            update_time: result.data[2].update_time,
          },
          {
            id: result.data[3].id,
            dashboard_id: result.data[3].dashboard_id,
            owner_id: null,
            owner_type: null,
            can_view: [],
            can_edit: [],
            create_time: result.data[3].create_time,
            update_time: result.data[3].update_time,
          },
          {
            id: result.data[4].id,
            dashboard_id: result.data[4].dashboard_id,
            owner_id: null,
            owner_type: null,
            can_view: [],
            can_edit: [],
            create_time: result.data[4].create_time,
            update_time: result.data[4].update_time,
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
      expect(result).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: result.data[0].id,
            dashboard_id: result.data[0].dashboard_id,
            owner_id: result.data[0].owner_id,
            owner_type: 'ACCOUNT',
            can_view: [],
            can_edit: [],
            create_time: result.data[0].create_time,
            update_time: result.data[0].update_time,
          },
          {
            id: result.data[1].id,
            dashboard_id: result.data[1].dashboard_id,
            owner_id: result.data[1].owner_id,
            owner_type: 'ACCOUNT',
            can_view: [],
            can_edit: [],
            create_time: result.data[1].create_time,
            update_time: result.data[1].update_time,
          },
          {
            id: result.data[2].id,
            dashboard_id: result.data[2].dashboard_id,
            owner_id: null,
            owner_type: null,
            can_view: [],
            can_edit: [],
            create_time: result.data[2].create_time,
            update_time: result.data[2].update_time,
          },
        ],
      });
    });
  });
});
