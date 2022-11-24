import { connectionHook } from './jest.util';
import { DataSourceService } from '~/services/datasource.service';
import DataSource from '~/models/datasource';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { DataSourceConfig } from '~/api_models/datasource';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ApiError, BAD_REQUEST } from '~/utils/errors';
import { maybeDecryptPassword, maybeEncryptPassword } from '~/utils/encryption';

const parseDBUrl = (connectionString: string): { username: string, password: string, host: string, port: number, database: string } => {
  const parts1 = connectionString.split(':');
  const username = parts1[0];
  const password = parts1[1].split('@')[0];
  const database = connectionString.substring(connectionString.lastIndexOf('/') + 1);
  let host: string;
  let port: number;
  if (parts1.length === 3) {
    host = parts1[1].split('@')[1];
    port = parseInt(parts1[2].split('/')[0]);
  } else {
    host = parts1[1].split('@')[1].split('/')[0];
    port = 5432;
  }
  return { username, password, host, port, database };
}

describe('DataSourceService', () => {
  connectionHook();
  let datasourceService: DataSourceService;
  let postgresConfig: DataSourceConfig;
  let presetDatasource: DataSource;
  let pgDatasource: DataSource;
  let httpDatasource: DataSource;

  beforeAll(async () => {
    datasourceService = new DataSourceService();
    const connectionString = process.env.TEST_PG_URL.substring(13);
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
      port
    };
    maybeEncryptPassword(presetData.config);
    presetDatasource = await dashboardDataSource.getRepository(DataSource).save(presetData);
    maybeDecryptPassword(presetDatasource);
    postgresConfig = { ...presetData.config, password };
  });

  describe('create', () => {
    it('should create successfully', async () => {
      pgDatasource = await datasourceService.create('postgresql', 'pg', postgresConfig);
      expect(pgDatasource).toMatchObject({
        type: 'postgresql',
        key: 'pg',
        config: {
          host: postgresConfig.host,
          username: postgresConfig.username,
          password: postgresConfig.password,
          database: postgresConfig.database,
          port: postgresConfig.port
        },
        id: pgDatasource.id,
        create_time: pgDatasource.create_time,
        update_time: pgDatasource.update_time,
        is_preset: false
      });

      httpDatasource = await datasourceService.create('http', 'jsonplaceholder', { host: 'http://jsonplaceholder.typicode.com' });
      expect(httpDatasource).toMatchObject({
        type: 'http',
        key: 'jsonplaceholder',
        config: {
          host: 'http://jsonplaceholder.typicode.com'
        },
        id: httpDatasource.id,
        create_time: httpDatasource.create_time,
        update_time: httpDatasource.update_time,
        is_preset: false
      })
    });

    it('should fail if duplicate', async () => {
      await expect(datasourceService.create('postgresql', 'pg', postgresConfig)).rejects.toThrowError(QueryFailedError);
    });

    it('should fail if config incorrect', async () => {
      await expect(datasourceService.create('postgresql', 'pg', { ...postgresConfig, port: 22 })).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Testing datasource connection failed' }));
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const datasources = await datasourceService.list(undefined, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20 });
      expect(datasources).toMatchObject({
        total: 3,
        offset: 0,
        data: [
          {
            id: datasources.data[0].id,
            type: 'postgresql',
            key: 'preset',
            is_preset: true
          },
          {
            id: datasources.data[1].id,
            type: 'postgresql',
            key: 'pg',
            is_preset: false
          },
          {
            id: datasources.data[2].id,
            type: 'http',
            key: 'jsonplaceholder',
            is_preset: false
          }
        ]
      });
    });

    it('with search filter', async () => {
      const datasources = await datasourceService.list({ search: 'preset' }, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20 });
      expect(datasources).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: datasources.data[0].id,
            type: 'postgresql',
            key: 'preset',
            is_preset: true
          }
        ]
      });
    });
  });

  describe('getByTypeKey', () => {
    it('should return successfully', async () => {
      const pg = await DataSourceService.getByTypeKey(presetDatasource.type, presetDatasource.key);
      expect(pg).toMatchObject(presetDatasource);

      const http = await DataSourceService.getByTypeKey(httpDatasource.type, httpDatasource.key);
      expect(http).toMatchObject(httpDatasource);
    });

    it('should fail if not found', async () => {
      await expect(DataSourceService.getByTypeKey('xxx', 'xxx')).rejects.toThrowError(EntityNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete successfully', async () => {
      await datasourceService.delete(pgDatasource.id);
      const datasources = await datasourceService.list(undefined, { field: 'create_time', order: 'ASC' }, { page: 1, pagesize: 20 });
      expect(datasources).toMatchObject({
        total: 2,
        offset: 0,
        data: [
          {
            id: datasources.data[0].id,
            type: 'postgresql',
            key: 'preset',
            is_preset: true
          },
          {
            id: datasources.data[1].id,
            type: 'http',
            key: 'jsonplaceholder',
            is_preset: false
          }
        ]
      });
    });

    it('should fail if not found', async () => {
      await expect(datasourceService.delete(pgDatasource.id)).rejects.toThrowError(EntityNotFoundError);
    });

    it('should fail if is preset datasource', async () => {
      await expect(datasourceService.delete(presetDatasource.id)).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Can not delete preset datasources' }));
    });
  });
});