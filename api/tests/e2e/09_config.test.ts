import bcrypt from 'bcrypt';
import { connectionHook, createAuthStruct } from './jest.util';
import { app } from '~/server';
import request from 'supertest';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';
import { ConfigGetRequest, ConfigUpdateRequest } from '~/api_models/config';
import Account from '~/models/account';
import ApiKey from '~/models/apiKey';
import Config from '~/models/config';
import { ConfigResourceTypes } from '~/services/config.service';
import { SALT_ROUNDS } from '~/utils/constants';
import { FIXED_ROLE_TYPES } from '~/services/role.service';

describe('ConfigController', () => {
  connectionHook();
  let superadminLogin: AccountLoginResponse;
  let readerLogin: AccountLoginResponse;
  let apiKey: ApiKey;
  const server = request(app);

  beforeAll(async () => {
    const query1: AccountLoginRequest = {
      name: 'superadmin',
      password: process.env.SUPER_ADMIN_PASSWORD ?? 'secret',
    };

    const response1 = await server.post('/account/login').send(query1);

    superadminLogin = response1.body;

    const account = new Account();
    account.name = 'reader';
    account.email = 'reader@test.com';
    account.password = await bcrypt.hash('12345678', SALT_ROUNDS);
    account.role_id = FIXED_ROLE_TYPES.READER;
    await dashboardDataSource.getRepository(Account).save(account);

    const query2: AccountLoginRequest = {
      name: account.name,
      password: '12345678',
    };

    const response2 = await server.post('/account/login').send(query2);

    readerLogin = response2.body;

    apiKey = await dashboardDataSource.getRepository(ApiKey).findOneBy({ name: 'key1' });

    const config = new Config();
    config.key = 'lang';
    config.value = 'zh';
    config.resource_type = ConfigResourceTypes.ACCOUNT;
    config.resource_id = superadminLogin.account.id;
    await dashboardDataSource.getRepository(Config).save(config);
  });

  describe('getDescriptions', () => {
    it('should return all descriptions', async () => {
      const response = await server.get('/config/getDescriptions').send();

      expect(response.body).toMatchObject([
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
    it('should return default locale when not authenticated or not updated', async () => {
      const request1: ConfigGetRequest = {
        key: 'lang',
      };

      const response1 = await server.post('/config/get').send(request1);

      expect(response1.body).toMatchObject({
        key: 'lang',
        value: 'en',
      });

      const authentication = createAuthStruct(apiKey, {
        key: 'lang',
      });

      const request2: ConfigGetRequest = {
        key: 'lang',
        authentication,
      };

      const response2 = await server.post('/config/get').send(request2);

      expect(response2.body).toMatchObject({
        key: 'lang',
        value: 'en',
      });

      const request3: ConfigGetRequest = {
        key: 'website_settings',
      };

      const response3 = await server.post('/config/get').send(request3);

      expect(response3.body).toMatchObject({
        key: 'website_settings',
        value:
          '{"WEBSITE_LOGO_URL_ZH":"WEBSITE_LOGO_URL_ZH","WEBSITE_LOGO_URL_EN":"WEBSITE_LOGO_URL_EN","WEBSITE_LOGO_JUMP_URL":"/WEBSITE_LOGO_JUMP_URL","WEBSITE_FAVICON_URL":"/WEBSITE_FAVICON_URL"}',
      });
    });

    it('should return saved locale', async () => {
      const request1: ConfigGetRequest = {
        key: 'lang',
      };

      const response1 = await server
        .post('/config/get')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request1);

      expect(response1.body).toMatchObject({
        key: 'lang',
        value: 'zh',
      });
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const request1: ConfigUpdateRequest = {
        key: 'lang',
        value: 'en',
      };

      const response1 = await server
        .post('/config/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request1);

      expect(response1.body).toMatchObject({
        key: 'lang',
        value: 'en',
      });

      const authentication = createAuthStruct(apiKey, {
        key: 'lang',
        value: 'zh',
      });

      const request2: ConfigUpdateRequest = {
        key: 'lang',
        value: 'zh',
        authentication,
      };

      const response2 = await server.post('/config/update').send(request2);

      expect(response2.body).toMatchObject({
        key: 'lang',
        value: 'zh',
      });

      const request3: ConfigUpdateRequest = {
        key: 'website_settings',
        value: '',
      };

      const response3 = await server
        .post('/config/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request3);

      expect(response3.body).toMatchObject({
        key: 'website_settings',
        value: '',
      });

      const dbConfigs = await dashboardDataSource.manager
        .createQueryBuilder()
        .from(Config, 'config')
        .select('config.resource_type', 'resource_type')
        .addSelect('config.resource_id', 'resource_id')
        .addSelect('config.key', 'key')
        .addSelect('config.value', 'value')
        .orderBy('config.create_time', 'ASC')
        .getRawMany();

      expect(dbConfigs).toMatchObject([
        {
          resource_type: 'ACCOUNT',
          resource_id: superadminLogin.account.id,
          key: 'lang',
          value: 'en',
        },
        {
          resource_type: 'APIKEY',
          resource_id: apiKey.id,
          key: 'lang',
          value: 'zh',
        },
        {
          resource_type: 'GLOBAL',
          resource_id: null,
          key: 'website_settings',
          value: '',
        },
      ]);
    });

    it('should fail if incorrect value', async () => {
      const req: ConfigUpdateRequest = {
        key: 'lang',
        value: 'incorrect_lang',
      };

      const response = await server
        .post('/config/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(req);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Incorrect config value', acceptedValues: ['en', 'zh'] },
      });
    });

    it('should fail if not authenticated', async () => {
      const request1: ConfigUpdateRequest = {
        key: 'lang',
        value: 'en',
      };

      const response1 = await server.post('/config/update').send(request1);

      expect(response1.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Must be authenticated for this config' },
      });

      const request2: ConfigUpdateRequest = {
        key: 'website_settings',
        value: '',
      };

      const response2 = await server.post('/config/update').send(request2);

      expect(response2.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Must be authenticated for this config' },
      });
    });

    it('should fail if not enough privileges', async () => {
      const req: ConfigUpdateRequest = {
        key: 'website_settings',
        value: '',
      };

      const response = await server
        .post('/config/update')
        .set('Authorization', `Bearer ${readerLogin.token}`)
        .send(req);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Insufficient privileges for this config' },
      });
    });
  });
});
