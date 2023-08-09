import { connectionHook, sleep } from './jest.util';
import { ConfigService, ConfigResourceTypes } from '~/services/config.service';
import { AccountService } from '~/services/account.service';
import { ApiService } from '~/services/api.service';
import Account from '~/models/account';
import { Account as AccountApiModel } from '~/api_models/account';
import ApiKey from '~/models/apiKey';
import { ApiKey as ApiKeyApiModel } from '~/api_models/api';
import Config from '~/models/config';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { DEFAULT_LANGUAGE } from '~/utils/constants';
import { ApiError, BAD_REQUEST } from '~/utils/errors';
import { FIXED_ROLE_TYPES } from '~/services/role.service';

describe('ConfigService', () => {
  connectionHook();
  let configService: ConfigService;
  let accountService: AccountService;
  let apiService: ApiService;
  let account1: AccountApiModel;
  let account2: AccountApiModel;
  let apiKey: ApiKeyApiModel;

  beforeAll(async () => {
    configService = new ConfigService();
    accountService = new AccountService();
    apiService = new ApiService();

    const account1Model = new Account();
    account1Model.id = 'ce11aa93-e0e6-4102-bc93-24eacf244133';
    account1Model.name = 'tmp1';
    account1Model.email = 'tmp1@test.com';
    account1Model.password = '12345678';
    account1Model.role_id = FIXED_ROLE_TYPES.ADMIN;
    account1Model.create_time = new Date();
    account1Model.update_time = new Date();
    await dashboardDataSource.getRepository(Account).save(account1Model);
    account1 = await accountService.get(account1Model.id, DEFAULT_LANGUAGE);

    const account2Model = new Account();
    account2Model.id = 'cec09093-e905-457a-b530-0a21034fff16';
    account2Model.name = 'tmp2';
    account2Model.email = 'tmp2@test.com';
    account2Model.password = '12345678';
    account2Model.role_id = FIXED_ROLE_TYPES.READER;
    account2Model.create_time = new Date();
    account2Model.update_time = new Date();
    await dashboardDataSource.getRepository(Account).save(account2Model);
    account2 = await accountService.get(account2Model.id, DEFAULT_LANGUAGE);

    const apiKeyModel = new ApiKey();
    apiKeyModel.id = '2a67e5d5-d473-43d4-88b5-8c97b7f2334d';
    apiKeyModel.name = 'tmp';
    apiKeyModel.is_preset = false;
    apiKeyModel.role_id = FIXED_ROLE_TYPES.ADMIN;
    apiKeyModel.app_id = 'tmp_appid';
    apiKeyModel.app_secret = 'tmp_appsecret';
    apiKeyModel.create_time = new Date();
    apiKeyModel.update_time = new Date();
    await dashboardDataSource.getRepository(ApiKey).save(apiKeyModel);
    apiKey = (
      await apiService.listKeys({ name: { isFuzzy: false, value: 'tmp' } }, [{ field: 'name', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      })
    ).data[0];

    const config = new Config();
    config.key = 'lang';
    config.value = 'zh';
    config.resource_type = ConfigResourceTypes.ACCOUNT;
    config.resource_id = account1.id;
    await dashboardDataSource.getRepository(Config).save(config);
  });

  describe('getDescriptions', () => {
    it('should return descriptions', async () => {
      const result = configService.getDescriptions(DEFAULT_LANGUAGE);
      expect(result).toMatchObject([
        {
          key: 'lang',
          description: 'Configure the locality of server responses',
        },
        {
          key: 'website_settings',
          description: 'Configurations for the website logo and favicon',
        },
        {
          key: 'query_cache_enabled',
          description: 'Configure whether to cache query results',
        },
        {
          key: 'query_cache_expire_time',
          description: 'Configure the time in seconds before query cache expires',
        },
      ]);
    });
  });

  describe('get', () => {
    it('should return default value', async () => {
      const result1 = await configService.get('lang');
      expect(result1).toMatchObject({
        key: 'lang',
        value: 'en',
      });

      const result2 = await configService.get('lang', account2);
      expect(result2).toMatchObject({
        key: 'lang',
        value: 'en',
      });

      const result3 = await configService.get('lang', apiKey);
      expect(result3).toMatchObject({
        key: 'lang',
        value: 'en',
      });

      const result4 = await configService.get('website_settings');
      expect(result4).toMatchObject({
        key: 'website_settings',
        value:
          '{"WEBSITE_LOGO_URL_ZH":"WEBSITE_LOGO_URL_ZH","WEBSITE_LOGO_URL_EN":"WEBSITE_LOGO_URL_EN","WEBSITE_LOGO_JUMP_URL":"/WEBSITE_LOGO_JUMP_URL","WEBSITE_FAVICON_URL":"/WEBSITE_FAVICON_URL"}',
      });
    });

    it('should return saved config', async () => {
      const result = await configService.get('lang', account1);
      expect(result).toMatchObject({
        key: 'lang',
        value: 'zh',
      });
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const result1 = await configService.update('lang', 'en', account1, DEFAULT_LANGUAGE);
      expect(result1).toMatchObject({
        key: 'lang',
        value: 'en',
      });

      const result2 = await configService.update('lang', 'zh', apiKey, DEFAULT_LANGUAGE);
      expect(result2).toMatchObject({
        key: 'lang',
        value: 'zh',
      });

      const result3 = await configService.update('website_settings', '', account1, DEFAULT_LANGUAGE);
      expect(result3).toMatchObject({
        key: 'website_settings',
        value: '',
      });
    });

    it('should fail if incorrect value', async () => {
      await expect(configService.update('lang', 'incorrect_lang', account1, DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, {
          message: 'Incorrect config value',
          acceptedValues: ConfigService.keyConfig['lang'].acceptedValues,
        }),
      );
    });

    it('should fail if not authenticated', async () => {
      await expect(configService.update('lang', 'en', undefined, DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Must be authenticated for this config' }),
      );

      await expect(configService.update('website_settings', '', undefined, DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Must be authenticated for this config' }),
      );
    });

    it('should fail if not enough privileges', async () => {
      await expect(configService.update('website_settings', '', account2, DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Insufficient privileges for this config' }),
      );
    });
  });

  describe('delete', () => {
    it('should delete', async () => {
      const qb = dashboardDataSource.manager
        .createQueryBuilder()
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
          resource_id: account1.id,
          key: 'lang',
          value: 'en',
        },
        {
          resource_type: ConfigResourceTypes.APIKEY,
          resource_id: apiKey.id,
          key: 'lang',
          value: 'zh',
        },
        {
          resource_type: ConfigResourceTypes.GLOBAL,
          resource_id: null,
          key: 'website_settings',
          value: '',
        },
      ]);

      await accountService.delete(account1.id, DEFAULT_LANGUAGE);
      await sleep(2000);
      await apiService.deleteKey(apiKey.id, DEFAULT_LANGUAGE);
      await sleep(2000);

      const configsAfter = await qb.getRawMany();

      expect(configsAfter).toMatchObject([
        {
          resource_type: ConfigResourceTypes.GLOBAL,
          resource_id: null,
          key: 'website_settings',
          value: '',
        },
      ]);
    });
  });
});
