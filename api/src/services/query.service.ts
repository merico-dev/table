import { ApiError, BAD_REQUEST } from '../utils/errors';
import { APIClient } from '../utils/api_client';
import { DataSourceService } from './datasource.service';
import { DataSource } from 'typeorm';
import { configureDatabaseSource } from '../utils/helpers';
import { validate } from '../middleware/validation';
import { HttpParams } from '../api_models/query';

export class QueryService {
  async query(type: string, key: string, query: string): Promise<any> {
    switch (type) {
      case 'postgresql':
        return await this.postgresqlQuery(key, query);

      case 'mysql':
        return await this.mysqlQuery(key, query);
      
      case 'http':
        return await this.httpQuery(key, query);
      
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

  private async httpQuery(key: string, query: string): Promise<any> {
    const params = validate(HttpParams, JSON.parse(query));
    const sourceConfig = await DataSourceService.getByTypeKey('http', key);
    const { host } = sourceConfig.config;
    return await APIClient.request(params.method)([host, params.url_postfix].join(''), params);
  };
}