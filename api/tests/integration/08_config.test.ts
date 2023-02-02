import { connectionHook } from './jest.util';
import { ConfigService, ConfigResourceTypes } from '~/services/config.service';
import { AccountService } from '~/services/account.service';
import { ApiService } from '~/services/api.service';
import Account from '~/models/account';
import ApiKey from '~/models/apiKey';
import Config from '~/models/config';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { DEFAULT_LANGUAGE } from '~/utils/constants';
import { ApiError, BAD_REQUEST } from '~/utils/errors';
import { ROLE_TYPES } from '~/api_models/role';

describe('ConfigService', () => {
  connectionHook();
  let configService: ConfigService;
  let accountService: AccountService;
  let apiService: ApiService;
  let account: Account;
  let apiKey: ApiKey;

  beforeAll(async () => {
    configService = new ConfigService();
    accountService = new AccountService();
    apiService = new ApiService();

    account = new Account();
    account.id = 'ce11aa93-e0e6-4102-bc93-24eacf244133';
    account.name = 'tmp';
    account.email = 'tmp@test.com';
    account.password = 'tmp';
    account.role_id = ROLE_TYPES.ADMIN;
    account.create_time = new Date();
    account.update_time = new Date();
    await dashboardDataSource.getRepository(Account).save(account);

    apiKey = new ApiKey();
    apiKey.id = '2a67e5d5-d473-43d4-88b5-8c97b7f2334d';
    apiKey.name = 'tmp';
    apiKey.is_preset = false;
    apiKey.role_id = ROLE_TYPES.ADMIN;
    apiKey.app_id = 'tmp_appid';
    apiKey.app_secret = 'tmp_appsecret';
    apiKey.create_time = new Date();
    apiKey.update_time = new Date();
    await dashboardDataSource.getRepository(ApiKey).save(apiKey);

    const config = new Config();
    config.key = 'lang';
    config.value = 'zh';
    config.resource_type = ConfigResourceTypes.ACCOUNT;
    config.resource_id = account.id;
    await dashboardDataSource.getRepository(Config).save(config);
  });

  describe('get', () => {
    it('should return default value', async () => {
      const result1 = await configService.get('lang', undefined);
      expect(result1).toMatchObject({
        key: 'lang',
        value: 'en'
      });

      const result2 = await configService.get('lang', apiKey);
      expect(result2).toMatchObject({
        key: 'lang',
        value: 'en'
      });
    });

    it('should return saved config', async () => {
      const result = await configService.get('lang', account);
      expect(result).toMatchObject({
        key: 'lang',
        value: 'zh'
      });
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const result1 = await configService.update('lang', 'en', account, DEFAULT_LANGUAGE);
      expect(result1).toMatchObject({
        key: 'lang',
        value: 'en'
      });

      const result2 = await configService.update('lang', 'zh', apiKey, DEFAULT_LANGUAGE);
      expect(result2).toMatchObject({
        key: 'lang',
        value: 'zh'
      });
    });

    it('should fail if incorrect value', async () => {
      await expect(configService.update('lang', 'incorrect_lang', account, DEFAULT_LANGUAGE)).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Incorrect value', acceptedValues: ConfigService.keyConfig['lang'].acceptedValues }));
    });

    it('should fail if not authenticated', async () => {
      await expect(configService.update('lang', 'en', undefined, DEFAULT_LANGUAGE)).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Must be authenticated for this config' }));
    });
  });

  describe('delete', () => {
    it('should delete', async () => {
      const qb = dashboardDataSource.manager.createQueryBuilder()
        .from(Config, 'config')
        .select('config.key', 'key')
        .addSelect('config.value', 'value')
        .addSelect('config.resource_type', 'resource_type')
        .addSelect('config.resource_id', 'resource_id')
        .orderBy('config.create_time', 'ASC');

      const configsBefore = await qb.getRawMany();

      expect(configsBefore).toMatchObject([
        {
          resource_type: ConfigResourceTypes.ACCOUNT,
          resource_id: account.id,
          key: 'lang',
          value: 'en'
        },
        {
          resource_type: ConfigResourceTypes.APIKEY,
          resource_id: apiKey.id,
          key: 'lang',
          value: 'zh'
        }
      ]);

      await accountService.delete(account.id, ROLE_TYPES.SUPERADMIN, DEFAULT_LANGUAGE);
      await apiService.deleteKey(apiKey.id, DEFAULT_LANGUAGE);

      const configsAfter = await qb.getRawMany();

      expect(configsAfter).toMatchObject([]);
    });
  });
});