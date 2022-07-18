import { ApiError, BAD_REQUEST } from '../utils/errors';
import { DataSourceService } from './datasource.service';
import { DataSource } from 'typeorm';
import { DataSourceConfig } from '../api_models/datasource';

const DATABASE_CONNECTION_TIMEOUT_MS = 5000;

export class QueryService {
  async query(type: string, key: string, query: string): Promise<any> {
    switch (type) {
      case 'postgresql':
        return await this.postgresqlQuery(key, query);

      case 'mysql':
        return await this.mysqlQuery(key, query);
      
      // case 'http':
      //   return await this.httpQuery(key, query);
      
      default:
        throw new ApiError(BAD_REQUEST, { message: 'unsupported datasource type' });
    }
  }

  private async postgresqlQuery(key: string, sql: string): Promise<object[]> {
    const sourceConfig = await DataSourceService.getByTypeKey('postgresql', key);
    const configuration = this.configureDatabaseSource(sourceConfig.config);
    const source = new DataSource({
      ...configuration,
      type: 'postgres',
      connectTimeoutMS: DATABASE_CONNECTION_TIMEOUT_MS,
    });
    await source.initialize();
    const result = await source.query(sql);
    await source.destroy();
    return result;
  }

  private async mysqlQuery(key: string, sql: string): Promise<object[]> {
    const sourceConfig = await DataSourceService.getByTypeKey('mysql', key);
    const configuration = this.configureDatabaseSource(sourceConfig.config);
    const source = new DataSource({
      ...configuration,
      type: 'mysql',
      connectTimeout : DATABASE_CONNECTION_TIMEOUT_MS,
    });
    await source.initialize();
    const result = await source.query(sql);
    await source.destroy();
    return result;
  }

  private configureDatabaseSource(config: DataSourceConfig) {
    return {
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database
    };
  }

  private async httpQuery(key: string, query: string): Promise<any> {
    // const sourceConfig = await DataSourceService.getByTypeKey('http', key);
    // try {
    //   const headers = {};
    //   // if (sourceConfig.config.credentials) {
    //   //   headers['Authorization'] = `Bearer ${access_token}`;
    //   // }
    //   return await APIClient.getRequest(sourceConfig.config.method?.toUpperCase() || 'GET')(sourceConfig.config.host, query, {headers});
    // } catch (error) {
    //   throw new ApiError(BAD_REQUEST, { message: error.message });
    // }
  }
}