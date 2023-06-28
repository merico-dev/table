import { connectionHook } from './jest.util';
import DataSource from '~/models/datasource';
import { dashboardDataSource } from '~/data_sources/dashboard';
import {
  DataSourceConfig,
  DataSourceCreateRequest,
  DataSourceIDRequest,
  DataSourceListRequest,
  DataSourceRenameRequest,
} from '~/api_models/datasource';
import { maybeDecryptPassword, maybeEncryptPassword } from '~/utils/encryption';
import { parseDBUrl } from '../utils';
import { app } from '~/server';
import request from 'supertest';
import { AccountLoginRequest, AccountLoginResponse } from '~/api_models/account';
import { notFoundId } from './constants';
import { omitFields } from '~/utils/helpers';

describe('DataSourceController', () => {
  connectionHook();
  let superadminLogin: AccountLoginResponse;
  let postgresConfig: DataSourceConfig;
  let presetDatasource: DataSource;
  let pgDatasource: DataSource;
  let httpDatasource: DataSource;
  const server = request(app);

  beforeAll(async () => {
    const query: AccountLoginRequest = {
      name: 'superadmin',
      password: process.env.SUPER_ADMIN_PASSWORD ?? 'secret',
    };

    const response = await server.post('/account/login').send(query);

    superadminLogin = response.body;

    const connectionString = process.env.END_2_END_TEST_PG_URL!;
    const { username, password, host, port, database } = parseDBUrl(connectionString);
    const presetData = new DataSource();
    presetData.type = 'postgresql';
    presetData.key = 'preset';
    presetData.is_preset = true;
    presetData.config = {
      host,
      username,
      password,
      database,
      port,
    };
    maybeEncryptPassword(presetData.config);
    presetDatasource = await dashboardDataSource.getRepository(DataSource).save(presetData);
    maybeDecryptPassword(presetDatasource);
    postgresConfig = { ...presetData.config, password };
  });

  describe('create', () => {
    it('should create successfully', async () => {
      const pgQuery: DataSourceCreateRequest = {
        type: 'postgresql',
        key: 'pg',
        config: {
          host: postgresConfig.host,
          username: postgresConfig.username,
          password: postgresConfig.password,
          database: postgresConfig.database,
          port: postgresConfig.port,
        },
      };

      const pgResponse = await server
        .post('/datasource/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(pgQuery);

      pgResponse.body = omitFields(pgResponse.body, ['create_time', 'update_time']);

      pgDatasource = pgResponse.body;
      expect(pgResponse.body).toMatchObject({
        type: 'postgresql',
        key: 'pg',
        config: {
          host: postgresConfig.host,
          username: postgresConfig.username,
          password: postgresConfig.password,
          database: postgresConfig.database,
          port: 5432,
        },
        id: pgDatasource.id,
        is_preset: false,
      });

      const httpQuery: DataSourceCreateRequest = {
        type: 'http',
        key: 'jsonplaceholder',
        config: {
          host: 'http://jsonplaceholder.typicode.com',
          processing: {
            pre: '',
            post: '',
          },
        },
      };

      const httpResponse = await server
        .post('/datasource/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(httpQuery);
      httpResponse.body = omitFields(httpResponse.body, ['create_time', 'update_time']);

      httpDatasource = httpResponse.body;
      expect(httpResponse.body).toMatchObject({
        type: 'http',
        key: 'jsonplaceholder',
        config: { host: 'http://jsonplaceholder.typicode.com', processing: { pre: '', post: '' } },
        id: httpDatasource.id,
        is_preset: false,
      });
    });

    it('should fail if duplicate', async () => {
      const query: DataSourceCreateRequest = {
        type: 'postgresql',
        key: 'pg',
        config: {
          host: postgresConfig.host,
          username: postgresConfig.username,
          password: postgresConfig.password,
          database: postgresConfig.database,
          port: postgresConfig.port,
        },
      };

      const response = await server
        .post('/datasource/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: {
          message: 'A data source with that type and key already exists',
        },
      });
    });

    it('should fail if config incorrect', async () => {
      const query: DataSourceCreateRequest = {
        type: 'postgresql',
        key: 'pg',
        config: {
          host: postgresConfig.host,
          username: postgresConfig.username,
          password: postgresConfig.password,
          database: postgresConfig.database,
          port: 22,
        },
      };

      const response = await server
        .post('/datasource/create')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Testing datasource connection failed' },
      });
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const query: DataSourceListRequest = {
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'key', order: 'ASC' }],
      };

      const response = await server
        .post('/datasource/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: response.body.data[0].id,
            type: 'http',
            key: 'jsonplaceholder',
            is_preset: false,
          },
          {
            id: response.body.data[1].id,
            type: 'postgresql',
            key: 'pg',
            is_preset: false,
          },
          {
            id: response.body.data[2].id,
            type: 'postgresql',
            key: 'preset',
            is_preset: true,
          },
        ],
      });
    });

    it('with filter', async () => {
      const query: DataSourceListRequest = {
        filter: { key: { value: 'preset', isFuzzy: true }, type: { value: 'sql', isFuzzy: true } },
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'key', order: 'ASC' }],
      };

      const response = await server
        .post('/datasource/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: response.body.data[0].id,
            type: 'postgresql',
            key: 'preset',
            is_preset: true,
          },
        ],
      });
    });
  });

  describe('rename', () => {
    it('should fail if not found', async () => {
      const query: DataSourceRenameRequest = {
        id: notFoundId,
        key: 'not_found',
      };

      const response = await server
        .put('/datasource/rename')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.detail.message).toContain('Could not find any entity of type "DataSource" matching');
      expect(response.body.detail.message).toContain(notFoundId);
    });

    it('should fail if new key is same as old one', async () => {
      const query: DataSourceRenameRequest = {
        id: httpDatasource.id,
        key: httpDatasource.key,
      };

      const response = await server
        .put('/datasource/rename')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'New key is the same as the old one' },
      });
    });

    it('should rename successfully', async () => {
      const query: DataSourceRenameRequest = {
        id: httpDatasource.id,
        key: 'jsonplaceholder_renamed',
      };

      const response = await server
        .put('/datasource/rename')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);
      response.body = omitFields(response.body, ['create_time', 'update_time']);
      expect(response.body).toMatchObject({
        type: 'RENAME_DATASOURCE',
        status: 'INIT',
        params: {
          type: 'http',
          old_key: 'jsonplaceholder',
          new_key: 'jsonplaceholder_renamed',
        },
        id: response.body.id,
      });
    });
  });

  describe('delete', () => {
    it('should delete successfully', async () => {
      const deleteQuery: DataSourceIDRequest = {
        id: pgDatasource.id,
      };

      await server.post('/datasource/delete').set('Authorization', `Bearer ${superadminLogin.token}`).send(deleteQuery);

      const query: DataSourceListRequest = {
        pagination: { page: 1, pagesize: 20 },
        sort: [{ field: 'key', order: 'ASC' }],
      };

      const response = await server
        .post('/datasource/list')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        total: 2,
        offset: 0,
        data: [
          {
            id: response.body.data[0].id,
            type: 'http',
            key: 'jsonplaceholder_renamed',
            is_preset: false,
          },
          {
            id: response.body.data[1].id,
            type: 'postgresql',
            key: 'preset',
            is_preset: true,
          },
        ],
      });
    });

    it('should fail if not found', async () => {
      const query: DataSourceIDRequest = {
        id: pgDatasource.id,
      };

      const response = await server
        .post('/datasource/delete')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body.code).toEqual('NOT_FOUND');
      expect(response.body.detail.message).toContain('Could not find any entity of type "DataSource" matching');
      expect(response.body.detail.message).toContain(pgDatasource.id);
    });

    it('should fail if is preset datasource', async () => {
      const query: DataSourceIDRequest = {
        id: presetDatasource.id,
      };

      const response = await server
        .post('/datasource/delete')
        .set('Authorization', `Bearer ${superadminLogin.token}`)
        .send(query);

      expect(response.body).toMatchObject({
        code: 'BAD_REQUEST',
        detail: { message: 'Can not delete preset datasources' },
      });
    });
  });
});
