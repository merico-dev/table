import { ApiError, BAD_REQUEST } from '../utils/errors';
import { APIClient } from '../utils/api_client';
import { DataSourceService } from './datasource.service';
import { DataSource } from 'typeorm';
import { configureDatabaseSource } from '../utils/helpers';

export class QueryService {
  async query(type: string, key: string, query: string): Promise<any> {
    switch (type) {
      case 'postgresql':
        return await this.postgresqlQuery(key, query);

      case 'mysql':
        return await this.mysqlQuery(key, query);
      
      case 'http':
        const func = `http${key}`;
        if (typeof this[func] === 'function') {
          return await this[func](query);
        } else {
          throw new ApiError(BAD_REQUEST, { message: `unknown http datasource ${key}` });
        }
      
      default:
        throw new ApiError(BAD_REQUEST, { message: 'unsupported datasource type' });
    }
  }

  private async postgresqlQuery(key: string, sql: string): Promise<object[]> {
    const sourceConfig = await DataSourceService.getByTypeKey('postgresql', key);
    const configuration = configureDatabaseSource('postgresql', sourceConfig.config);
    const source = new DataSource(configuration);
    await source.initialize();
    const result = await source.query(sql);
    await source.destroy();
    return result;
  }

  private async mysqlQuery(key: string, sql: string): Promise<object[]> {
    const sourceConfig = await DataSourceService.getByTypeKey('mysql', key);
    const configuration = configureDatabaseSource('mysql', sourceConfig.config);
    const source = new DataSource(configuration);
    await source.initialize();
    const result = await source.query(sql);
    await source.destroy();
    return result;
  }
}