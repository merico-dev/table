import { connectionHook, createAuthStruct } from './jest.util';
import * as validation from '~/middleware/validation';
import { app } from '~/server';
import request from 'supertest';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';
import { ConfigGetRequest, ConfigUpdateRequest } from '~/api_models/config';
import ApiKey from '~/models/apiKey';
import Config from '~/models/config';
import { ConfigResourceTypes } from '~/services/config.service';

describe('ConfigController', () => {
  connectionHook();
  let superadminLogin: AccountLoginResponse;
  let apiKey: ApiKey;
  const server = request(app);

  const validate = jest.spyOn(validation, 'validate');

  beforeAll(async () => {
    const query: AccountLoginRequest = {
      name: 'superadmin',
      password: process.env.SUPER_ADMIN_PASSWORD ?? 'secret',
    };
    validate.mockReturnValueOnce(query);

    const response = await server.post('/account/login').send(query);

    superadminLogin = response.body;

    apiKey = await dashboardDataSource.getRepository(ApiKey).findOneBy({ name: 'key1' });

    const config = new Config();
    config.key = 'lang';
    config.value = 'zh';
    config.resource_type = ConfigResourceTypes.ACCOUNT;
    config.resource_id = superadminLogin.account.id;
    await dashboardDataSource.getRepository(Config).save(config);
  });

  beforeEach(() => {
    validate.mockReset();
  });

  describe('get', () => {
    it('should return default locale when not authenticated or not updated', async () => {
      const request1: ConfigGetRequest = {
        key: 'lang',
      };
      validate.mockReturnValueOnce(request1);

      const response1 = await server
        .post('/config/get')
        .send(request1);

      expect(response1.body).toMatchObject({
        key: 'lang',
        value: 'en'
      });

      const authentication = createAuthStruct(apiKey, {
        key: 'lang'
      });
      validate.mockReturnValueOnce(authentication);

      const request2: ConfigGetRequest = {
        key: 'lang',
        authentication
      };
      validate.mockReturnValueOnce(request2);

      const response2 = await server
        .post('/config/get')
        .send(request2);

      expect(response2.body).toMatchObject({
        key: 'lang',
        value: 'en'
      });
    });

    it('should return saved locale', async () => {
      const request1: ConfigGetRequest = {
        key: 'lang',
      };
      validate.mockReturnValueOnce(request1);

      const response1 = await server
        .post('/config/get')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request1);

      expect(response1.body).toMatchObject({
        key: 'lang',
        value: 'zh'
      });
    });
  });

  describe('update', () => {
    it('should update successfully', async () => {
      const request1: ConfigUpdateRequest = {
        key: 'lang',
        value: 'en',
      };
      validate.mockReturnValueOnce(request1);

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
      validate.mockReturnValueOnce(authentication);

      const request2: ConfigUpdateRequest = {
        key: 'lang',
        value: 'zh',
        authentication
      };
      validate.mockReturnValueOnce(request2);

      const response2 = await server.post('/config/update').send(request2);

      expect(response2.body).toMatchObject({
        key: 'lang',
        value: 'zh',
      });

      const dbConfigs = await dashboardDataSource.manager.createQueryBuilder()
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
          value: 'en'
        },
        {
          resource_type: 'APIKEY',
          resource_id: apiKey.id,
          key: 'lang',
          value: 'zh'
        }
      ]);
    });

    it('should fail if incorrect value', async () => {
      const request: ConfigUpdateRequest = {
        key: 'lang',
        value: 'incorrect_lang',
      };
      validate.mockReturnValueOnce(request);

      const response = await server
        .post('/config/update')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(request);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Incorrect value', acceptedValues: [ 'en', 'zh' ] }
      });
    });

    it('should fail if not authenticated', async () => {
      const request: ConfigUpdateRequest = {
        key: 'lang',
        value: 'en',
      };
      validate.mockReturnValueOnce(request);

      const response = await server
        .post('/config/update')
        .send(request);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Must be authenticated for this config' }
      });
    });
  });
});