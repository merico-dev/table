import { PaginationRequest } from '../api_models/base';
import { DataSourceFilterObject, DataSourceSortObject, DataSourcePaginationResponse, DataSourceConfig } from '../api_models/datasource';
import { dashboardDataSource } from '../data_sources/dashboard';
import DataSource from '../models/datasource';
import { maybeEncryptPassword, maybeDecryptPassword } from '../utils/encryption';

export class DataSourceService {
  static async getByTypeKey(type: string, key: string): Promise<DataSource> {
    const dataSourceRepo = dashboardDataSource.getRepository(DataSource);
    const result = await dataSourceRepo.findOneByOrFail({ type, key });
    maybeDecryptPassword(result);
    return result;
  }

  async list(filter: DataSourceFilterObject | undefined, sort: DataSourceSortObject, pagination: PaginationRequest): Promise<DataSourcePaginationResponse> {
    const offset = pagination.pagesize * (pagination.page - 1);
    const qb = dashboardDataSource.manager.createQueryBuilder()
      .from(DataSource, 'datasource')
      .orderBy(sort.field, sort.order)
      .offset(offset).limit(pagination.pagesize);

    if (filter?.search) {
      qb.where('datasource.type ilike :typeSearch OR datasource.key ilike :keySearch', { typeSearch: `%${filter.search}%`, keySearch: `%${filter.search}%` });
    }

    const datasources = await qb.getRawMany<DataSource>();
    const total = await qb.getCount();
    return {
      total,
      offset,
      data: datasources,
    };
  }

  async create(type: string, key: string, config: DataSourceConfig): Promise<DataSource> {
    maybeEncryptPassword(config);
    const dataSourceRepo = dashboardDataSource.getRepository(DataSource);
    const dataSource = new DataSource();
    dataSource.type = type;
    dataSource.key = key;
    dataSource.config = config;
    let result = await dataSourceRepo.save(dataSource);
    maybeDecryptPassword(result);
    return result;
  }

  async get(id: string): Promise<DataSource> {
    const dataSourceRepo = dashboardDataSource.getRepository(DataSource);
    const result = await dataSourceRepo.findOneByOrFail({ id });
    maybeDecryptPassword(result);
    return result;
  }

  async update(id: string, type: string, key: string, config: DataSourceConfig): Promise<DataSource> {
    maybeEncryptPassword(config);
    const dataSourceRepo = dashboardDataSource.getRepository(DataSource);
    const dataSource = await dataSourceRepo.findOneByOrFail({ id });
    dataSource.type = type;
    dataSource.key = key;
    dataSource.config = config;
    const result = await dataSourceRepo.save(dataSource);
    maybeDecryptPassword(result);
    return result;
  }

  async delete(id: string): Promise<void> {
    const dataSourceRepo = dashboardDataSource.getRepository(DataSource);
    await dataSourceRepo.delete(id);
  }
}