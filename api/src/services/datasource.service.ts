import { DataSource as Source } from 'typeorm';
import { PaginationRequest } from '../api_models/base';
import { DataSourceFilterObject, DataSourceSortObject, DataSourcePaginationResponse, DataSourceConfig } from '../api_models/datasource';
import { dashboardDataSource } from '../data_sources/dashboard';
import DataSource from '../models/datasource';
import { maybeEncryptPassword, maybeDecryptPassword } from '../utils/encryption';
import { ApiError, BAD_REQUEST } from '../utils/errors';
import { configureDatabaseSource, escapeLikePattern } from '../utils/helpers';

export class DataSourceService {
  static async getByTypeKeyPreset(type: string, key: string, is_preset: boolean): Promise<DataSource> {
    const dataSourceRepo = dashboardDataSource.getRepository(DataSource);
    const result = await dataSourceRepo.findOneByOrFail({ type, key, is_preset });
    maybeDecryptPassword(result);
    return result;
  }

  async list(filter: DataSourceFilterObject | undefined, sort: DataSourceSortObject, pagination: PaginationRequest): Promise<DataSourcePaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager.createQueryBuilder()
      .from(DataSource, 'datasource')
      .select('datasource.id', 'id')
      .addSelect('datasource.type', 'type')
      .addSelect('datasource.key', 'key')
      .addSelect('datasource.is_preset', 'is_preset')
      .orderBy(sort.field, sort.order)
      .offset(offset).limit(pagination.pagesize);

    if (filter?.search) {
      qb.where('datasource.type ilike :typeSearch OR datasource.key ilike :keySearch', { typeSearch: `%${escapeLikePattern(filter.search)}%`, keySearch: `%${escapeLikePattern(filter.search)}%` });
    }

    const datasources = await qb.getRawMany<DataSource>();
    const total = await qb.getCount();
    return {
      total,
      offset,
      data: datasources,
    };
  }

  async create(type: 'mysql' | 'postgresql' | 'http', key: string, config: DataSourceConfig): Promise<DataSource> {
    if (type !== 'http') {
      await this.testDatabaseConfiguration(type, config);
    }
    maybeEncryptPassword(config);
    const dataSourceRepo = dashboardDataSource.getRepository(DataSource);
    const dataSource = new DataSource();
    dataSource.type = type;
    dataSource.key = key;
    dataSource.config = config;
    const result = await dataSourceRepo.save(dataSource);
    maybeDecryptPassword(result);
    return result;
  }

  async delete(id: string): Promise<void> {
    const dataSourceRepo = dashboardDataSource.getRepository(DataSource);
    const datasource = await dataSourceRepo.findOneByOrFail({ id });
    if (datasource.is_preset) {
      throw new ApiError(BAD_REQUEST, { message: 'Can not delete preset datasources' });
    }
    await dataSourceRepo.delete(datasource.id);
  }

  private async testDatabaseConfiguration(type: 'mysql' | 'postgresql', config: DataSourceConfig): Promise<void> {
    const configuration = configureDatabaseSource(type, config);
    const source = new Source(configuration);
    try {
      await source.initialize();
    } catch (error) {
      throw new ApiError(BAD_REQUEST, { message: 'Testing datasource connection failed' });      
    }
    await source.destroy();
  }
}