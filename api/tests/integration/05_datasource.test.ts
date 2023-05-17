import { connectionHook, sleep } from './jest.util';
import { DataSourceService } from '~/services/datasource.service';
import DataSource from '~/models/datasource';
import { dashboardDataSource } from '~/data_sources/dashboard';
import { EntityNotFoundError } from 'typeorm';
import { ApiError, BAD_REQUEST } from '~/utils/errors';
import { notFoundId, pgSourceConfig } from './constants';
import { maybeDecryptPassword } from '~/utils/encryption';
import { DEFAULT_LANGUAGE } from '~/utils/constants';
import { omitTime } from '~/utils/helpers';

describe('DataSourceService', () => {
  connectionHook();
  let datasourceService: DataSourceService;
  let dataSources: DataSource[];
  let pgDatasource: DataSource;
  let httpDatasource: DataSource;

  beforeAll(async () => {
    datasourceService = new DataSourceService();
    dataSources = await dashboardDataSource.manager.find(DataSource, { order: { type: 'ASC', key: 'ASC' } });
  });

  describe('create', () => {
    it('should create successfully', async () => {
      pgDatasource = await datasourceService.create('postgresql', 'pg_2', pgSourceConfig, DEFAULT_LANGUAGE);
      expect(omitTime(pgDatasource)).toMatchObject({
        type: 'postgresql',
        key: 'pg_2',
        config: pgSourceConfig,
        id: pgDatasource.id,
        is_preset: false,
      });

      httpDatasource = await datasourceService.create(
        'http',
        'jsonplaceholder_2',
        {
          host: 'http://jsonplaceholder.typicode.com',
          processing: {
            pre: '',
            post: '',
          },
        },
        DEFAULT_LANGUAGE,
      );
      expect(omitTime(httpDatasource)).toMatchObject({
        type: 'http',
        key: 'jsonplaceholder_2',
        config: dataSources[0].config,
        id: httpDatasource.id,
        is_preset: false,
      });
    });

    it('should fail if duplicate', async () => {
      await expect(
        datasourceService.create('postgresql', 'pg_2', pgSourceConfig, DEFAULT_LANGUAGE),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'A data source with that type and key already exists' }),
      );
      await expect(
        datasourceService.create('http', 'jsonplaceholder_2', pgSourceConfig, DEFAULT_LANGUAGE),
      ).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'A data source with that type and key already exists' }),
      );
    });

    it('should fail if config incorrect', async () => {
      await expect(
        datasourceService.create('postgresql', 'pg_2', { ...pgSourceConfig, port: 22 }, DEFAULT_LANGUAGE),
      ).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'Testing datasource connection failed' }));
    });
  });

  describe('list', () => {
    it('no filters', async () => {
      const datasources = await datasourceService.list(undefined, [{ field: 'create_time', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      });
      expect(datasources).toMatchObject({
        total: 4,
        offset: 0,
        data: [
          {
            id: dataSources[1].id,
            type: dataSources[1].type,
            key: dataSources[1].key,
            is_preset: dataSources[1].is_preset,
          },
          {
            id: dataSources[0].id,
            type: dataSources[0].type,
            key: dataSources[0].key,
            is_preset: dataSources[0].is_preset,
          },
          {
            id: pgDatasource.id,
            type: pgDatasource.type,
            key: pgDatasource.key,
            is_preset: pgDatasource.is_preset,
          },
          {
            id: httpDatasource.id,
            type: httpDatasource.type,
            key: httpDatasource.key,
            is_preset: httpDatasource.is_preset,
          },
        ],
      });
    });

    it('with search filter', async () => {
      const datasources = await datasourceService.list(
        { key: { value: 'pg_2', isFuzzy: true }, type: { value: '', isFuzzy: true } },
        [{ field: 'create_time', order: 'ASC' }],
        { page: 1, pagesize: 20 },
      );
      expect(datasources).toMatchObject({
        total: 1,
        offset: 0,
        data: [
          {
            id: pgDatasource.id,
            type: pgDatasource.type,
            key: pgDatasource.key,
            is_preset: pgDatasource.is_preset,
          },
        ],
      });
    });
  });

  describe('getByTypeKey', () => {
    it('should return successfully', async () => {
      const pg = await DataSourceService.getByTypeKey(dataSources[1].type, dataSources[1].key);
      maybeDecryptPassword(dataSources[1]);
      expect(pg).toMatchObject(dataSources[1]);

      const http = await DataSourceService.getByTypeKey(httpDatasource.type, httpDatasource.key);
      expect(http).toMatchObject(httpDatasource);
    });

    it('should fail if not found', async () => {
      await expect(DataSourceService.getByTypeKey('xxx', 'xxx')).rejects.toThrowError(EntityNotFoundError);
    });
  });

  describe('rename', () => {
    it('should fail if new key is same as old key', async () => {
      await expect(
        datasourceService.rename(pgDatasource.id, pgDatasource.key, DEFAULT_LANGUAGE, null, null),
      ).rejects.toThrowError(new ApiError(BAD_REQUEST, { message: 'New key is the same as the old one' }));
    });

    it('should fail if entity not found', async () => {
      await expect(datasourceService.rename(notFoundId, '', DEFAULT_LANGUAGE, null, null)).rejects.toThrowError(
        EntityNotFoundError,
      );
    });

    it('should rename successfully', async () => {
      const newPGKey = pgDatasource.key + '_renamed';
      const pgResult = await datasourceService.rename(pgDatasource.id, newPGKey, DEFAULT_LANGUAGE, null, null);
      expect(omitTime(pgResult)).toMatchObject({
        type: 'RENAME_DATASOURCE',
        status: 'INIT',
        params: { type: pgDatasource.type, old_key: pgDatasource.key, new_key: newPGKey },
        id: pgResult.id,
      });

      const newHTTPKey = httpDatasource.key + '_renamed';
      const httpResult = await datasourceService.rename(httpDatasource.id, newHTTPKey, DEFAULT_LANGUAGE, null, null);
      expect(omitTime(httpResult)).toMatchObject({
        type: 'RENAME_DATASOURCE',
        status: 'INIT',
        params: { type: httpDatasource.type, old_key: httpDatasource.key, new_key: newHTTPKey },
        id: httpResult.id,
      });

      await sleep(3000);
    });
  });

  describe('delete', () => {
    it('should delete successfully', async () => {
      await datasourceService.delete(pgDatasource.id, DEFAULT_LANGUAGE);
      await datasourceService.delete(httpDatasource.id, DEFAULT_LANGUAGE);
      const datasources = await datasourceService.list(undefined, [{ field: 'create_time', order: 'ASC' }], {
        page: 1,
        pagesize: 20,
      });
      expect(datasources).toMatchObject({
        total: 2,
        offset: 0,
        data: [
          {
            id: dataSources[1].id,
            type: dataSources[1].type,
            key: dataSources[1].key,
            is_preset: dataSources[1].is_preset,
          },
          {
            id: dataSources[0].id,
            type: dataSources[0].type,
            key: dataSources[0].key,
            is_preset: dataSources[0].is_preset,
          },
        ],
      });
    });

    it('should fail if not found', async () => {
      await expect(datasourceService.delete(pgDatasource.id, DEFAULT_LANGUAGE)).rejects.toThrowError(
        EntityNotFoundError,
      );
      await expect(datasourceService.delete(httpDatasource.id, DEFAULT_LANGUAGE)).rejects.toThrowError(
        EntityNotFoundError,
      );
    });

    it('should fail if is preset datasource', async () => {
      await expect(datasourceService.delete(dataSources[0].id, DEFAULT_LANGUAGE)).rejects.toThrowError(
        new ApiError(BAD_REQUEST, { message: 'Can not delete preset datasources' }),
      );
    });
  });
});
