import { DataSource as Source } from 'typeorm';
import { PaginationRequest } from '../api_models/base';
import {
  DataSourceFilterObject,
  DataSourceSortObject,
  DataSourcePaginationResponse,
  DataSourceConfig,
} from '../api_models/datasource';
import { Job } from '../api_models/job';
import { dashboardDataSource } from '../data_sources/dashboard';
import DataSource from '../models/datasource';
import { maybeEncryptPassword, maybeDecryptPassword } from '../utils/encryption';
import { ApiError, BAD_REQUEST } from '../utils/errors';
import { configureDatabaseSource, escapeLikePattern } from '../utils/helpers';
import { translate } from '../utils/i18n';
import { JobService, RenameJobParams } from './job.service';
import { QueryService } from './query.service';

export class DataSourceService {
  static async getByTypeKey(type: string, key: string): Promise<DataSource> {
    const dataSourceRepo = dashboardDataSource.getRepository(DataSource);
    const result = await dataSourceRepo.findOneByOrFail({ type, key });
    maybeDecryptPassword(result);
    return result;
  }

  async list(
    filter: DataSourceFilterObject | undefined,
    sort: DataSourceSortObject[],
    pagination: PaginationRequest,
  ): Promise<DataSourcePaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager
      .createQueryBuilder()
      .from(DataSource, 'datasource')
      .select('datasource.id', 'id')
      .addSelect('datasource.type', 'type')
      .addSelect('datasource.key', 'key')
      .addSelect('datasource.is_preset', 'is_preset')
      .addSelect('datasource.config', 'config')
      .where('true')
      .orderBy(sort[0].field, sort[0].order)
      .offset(offset)
      .limit(pagination.pagesize);

    if (filter !== undefined) {
      if (filter.type) {
        filter.type.isFuzzy
          ? qb.andWhere('datasource.type ilike :type', { type: `%${escapeLikePattern(filter.type.value)}%` })
          : qb.andWhere('datasource.type = :type', { type: filter.type.value });
      }
      if (filter.key) {
        filter.key.isFuzzy
          ? qb.andWhere('datasource.key ilike :key', { key: `%${escapeLikePattern(filter.key.value)}%` })
          : qb.andWhere('datasource.key = :key', { key: filter.key.value });
      }
    }

    sort.slice(1).forEach((s) => {
      qb.addOrderBy(s.field, s.order);
    });

    const datasources = await qb.getRawMany<DataSource>();
    const total = await qb.getCount();
    return {
      total,
      offset,
      data: datasources.map((d) => ({
        ...d,
        config: d.type !== 'http' ? {} : d.config,
      })),
    };
  }

  async create(
    type: 'mysql' | 'postgresql' | 'http',
    key: string,
    config: DataSourceConfig,
    locale: string,
  ): Promise<DataSource> {
    if (type !== 'http') {
      await this.testDatabaseConfiguration(type, config, locale);
    }
    maybeEncryptPassword(config);
    const dataSourceRepo = dashboardDataSource.getRepository(DataSource);
    if (await dataSourceRepo.exist({ where: { type, key } })) {
      throw new ApiError(BAD_REQUEST, { message: translate('DATASOURCE_TYPE_KEY_ALREADY_EXISTS', locale) });
    }
    const dataSource = new DataSource();
    dataSource.type = type;
    dataSource.key = key;
    dataSource.config = config;
    const result = await dataSourceRepo.save(dataSource);
    maybeDecryptPassword(result);
    return result;
  }

  async rename(
    id: string,
    key: string,
    locale: string,
    auth_id: string | null,
    auth_type: string | null,
  ): Promise<Job> {
    const dataSourceRepo = dashboardDataSource.getRepository(DataSource);
    const dataSource = await dataSourceRepo.findOneByOrFail({ id });
    if (dataSource.key === key) {
      throw new ApiError(BAD_REQUEST, { message: translate('DATASOURCE_RENAME_SAME_KEY', locale) });
    }
    const jobParams: RenameJobParams = {
      type: dataSource.type,
      old_key: dataSource.key,
      new_key: key,
      auth_id,
      auth_type,
    };
    const result = await JobService.addRenameDataSourceJob(jobParams);
    return result;
  }

  async delete(id: string, locale: string): Promise<void> {
    const dataSourceRepo = dashboardDataSource.getRepository(DataSource);
    const datasource = await dataSourceRepo.findOneByOrFail({ id });
    if (datasource.is_preset) {
      throw new ApiError(BAD_REQUEST, { message: translate('DATASOURCE_NO_DELETE_PRESET', locale) });
    }
    await dataSourceRepo.delete(datasource.id);
    await QueryService.removeDBConnection(datasource.type, datasource.key);
  }

  private async testDatabaseConfiguration(
    type: 'mysql' | 'postgresql',
    config: DataSourceConfig,
    locale: string,
  ): Promise<void> {
    const configuration = configureDatabaseSource(type, config);
    const source = new Source(configuration);
    try {
      await source.initialize();
    } catch (error) {
      throw new ApiError(BAD_REQUEST, { message: translate('DATASOURCE_CONNECTION_TEST_FAILED', locale) });
    }
    await source.destroy();
  }
}
