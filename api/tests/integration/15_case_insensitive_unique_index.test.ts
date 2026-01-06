import { connectionHook } from './jest.util';
import { AccountService } from '~/services/account.service';
import { ApiService } from '~/services/api.service';
import { ApiError, BAD_REQUEST } from '~/utils/errors';
import { dashboardDataSource } from '~/data_sources/dashboard';
import Account from '~/models/account';
import ApiKey from '~/models/apiKey';
import { FIXED_ROLE_TYPES } from '~/services/role.service';
import { DEFAULT_LANGUAGE } from '~/utils/constants';

describe('Case-Insensitive Unique Index Migration', () => {
  connectionHook();
  let accountService: AccountService;
  let apiService: ApiService;

  beforeAll(async () => {
    accountService = new AccountService();
    apiService = new ApiService();
  });

  describe('account.name case-insensitive uniqueness', () => {
    it('should reject duplicate name with different case', async () => {
      const existingAccount = await dashboardDataSource.manager.findOne(Account, {
        where: { name: 'account1' },
      });
      expect(existingAccount).toBeDefined();

      await expect(
        accountService.create(
          'ACCOUNT1',
          'different@test.com',
          'password',
          FIXED_ROLE_TYPES.ADMIN,
          DEFAULT_LANGUAGE,
        ),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'An account with that name or email already exists' }),
      );
    });

    it('should reject duplicate name with mixed case', async () => {
      await expect(
        accountService.create(
          'AcCoUnT1',
          'mixedcase@test.com',
          'password',
          FIXED_ROLE_TYPES.ADMIN,
          DEFAULT_LANGUAGE,
        ),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'An account with that name or email already exists' }),
      );
    });

    it('should accept different name', async () => {
      const account = await accountService.create(
        'NewAccount',
        'newaccount@test.com',
        'password',
        FIXED_ROLE_TYPES.ADMIN,
        DEFAULT_LANGUAGE,
      );
      expect(account.name).toBe('NewAccount');

      // Cleanup
      await accountService.delete(account.id, DEFAULT_LANGUAGE);
    });
  });

  describe('account.email case-insensitive uniqueness', () => {
    it('should reject duplicate email with different case', async () => {
      const existingAccount = await dashboardDataSource.manager.findOne(Account, {
        where: { email: 'account1@test.com' },
      });
      expect(existingAccount).toBeDefined();

      await expect(
        accountService.create(
          'newuser',
          'ACCOUNT1@TEST.COM',
          'password',
          FIXED_ROLE_TYPES.ADMIN,
          DEFAULT_LANGUAGE,
        ),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'An account with that name or email already exists' }),
      );
    });

    it('should reject duplicate email with mixed case', async () => {
      await expect(
        accountService.create(
          'anotheruser',
          'AcCoUnT1@TeSt.CoM',
          'password',
          FIXED_ROLE_TYPES.ADMIN,
          DEFAULT_LANGUAGE,
        ),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'An account with that name or email already exists' }),
      );
    });
  });

  describe('api_key.name case-insensitive uniqueness', () => {
    it('should reject duplicate name with different case', async () => {
      const existingKey = await dashboardDataSource.manager.findOne(ApiKey, {
        where: { name: 'apikey1' },
      });
      expect(existingKey).toBeDefined();

      await expect(
        apiService.createKey('APIKEY1', FIXED_ROLE_TYPES.ADMIN, DEFAULT_LANGUAGE),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'An ApiKey with that name already exists' }),
      );
    });

    it('should reject duplicate name with mixed case', async () => {
      await expect(
        apiService.createKey('ApIkEy1', FIXED_ROLE_TYPES.ADMIN, DEFAULT_LANGUAGE),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'An ApiKey with that name already exists' }),
      );
    });

    it('should accept different name', async () => {
      const { app_id } = await apiService.createKey(
        'NewApiKey',
        FIXED_ROLE_TYPES.ADMIN,
        DEFAULT_LANGUAGE,
      );
      expect(app_id).toBeDefined();

      // Cleanup
      const apiKey = await dashboardDataSource.manager.findOneByOrFail(ApiKey, { app_id });
      await apiService.deleteKey(apiKey.id, DEFAULT_LANGUAGE);
    });
  });

  describe('combined name and email check', () => {
    it('should reject when name matches existing name', async () => {
      await expect(
        accountService.create(
          'account2',
          'totallynewemail@test.com',
          'password',
          FIXED_ROLE_TYPES.ADMIN,
          DEFAULT_LANGUAGE,
        ),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'An account with that name or email already exists' }),
      );
    });

    it('should reject when email matches existing email', async () => {
      await expect(
        accountService.create(
          'totallynewname',
          'account2@test.com',
          'password',
          FIXED_ROLE_TYPES.ADMIN,
          DEFAULT_LANGUAGE,
        ),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'An account with that name or email already exists' }),
      );
    });

    it('should reject when both match (case insensitive)', async () => {
      await expect(
        accountService.create(
          'ACCOUNT3',
          'ACCOUNT3@TEST.COM',
          'password',
          FIXED_ROLE_TYPES.ADMIN,
          DEFAULT_LANGUAGE,
        ),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'An account with that name or email already exists' }),
      );
    });
  });
});
