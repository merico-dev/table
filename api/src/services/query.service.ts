import { APIClient } from '../utils/api_client';
import { DataSourceService } from './datasource.service';
import { DataSource } from 'typeorm';
import { configureDatabaseSource } from '../utils/helpers';
import { validateClass } from '../middleware/validation';
import { HttpParams } from '../api_models/query';
import { sqlRewriter } from '../plugins';
import { ApiError, QUERY_ERROR } from '../utils/errors';

export class QueryService {
  static dbConnections: { [hash: string]: DataSource }[] = [];

  static createDBConnectionHash(type: string, key: string): string {
    return `${type}_${key}`;
  }

  static async addDBConnection(type: string, key: string, source: DataSource): Promise<void> {
    const hash = this.createDBConnectionHash(type, key);
    if (!source.isInitialized) {
      await source.initialize();
    }
    this.dbConnections[hash] = source;
  }

  static getDBConnection(type: string, key: string): DataSource | undefined {
    const hash = this.createDBConnectionHash(type, key);
    return this.dbConnections[hash];
  }

  static async removeDBConnection(type: string, key: string): Promise<void> {
    const source = this.getDBConnection(type, key);
    if (source) {
      if (source.isInitialized) {
        await source.destroy();
      }
      const hash = this.createDBConnectionHash(type, key);
      delete this.dbConnections[hash];
    }
  }

  async query(type: string, key: string, query: string, env: Record<string, any>): Promise<any> {
    let q: string = query;
    if (['postgresql', 'mysql'].includes(type)) {
      const { error, sql } = await sqlRewriter(query, env);
      if (error) {
        throw new ApiError(QUERY_ERROR, { message: error });
      }
      q = sql;
    }

    switch (type) {
      case 'postgresql':
        return await this.postgresqlQuery(key, q);

      case 'mysql':
        return await this.mysqlQuery(key, q);

      case 'http':
        return await this.httpQuery(key, q);

      default:
        return null;
    }
  }

  private async postgresqlQuery(key: string, query: string): Promise<object[]> {
    let source = QueryService.getDBConnection('postgresql', key);
    if (!source) {
      const sourceConfig = await DataSourceService.getByTypeKey('postgresql', key);
      const configuration = configureDatabaseSource('postgresql', sourceConfig.config);
      source = new DataSource(configuration);
      await QueryService.addDBConnection('postgresql', key, source);
    }
    return await source.query(query);
  }

  private async mysqlQuery(key: string, query: string): Promise<object[]> {
    let source = QueryService.getDBConnection('mysql', key);
    if (!source) {
      const sourceConfig = await DataSourceService.getByTypeKey('mysql', key);
      const configuration = configureDatabaseSource('mysql', sourceConfig.config);
      source = new DataSource(configuration);
      await QueryService.addDBConnection('mysql', key, source);
    }
    return await source.query(query);
  }

  private async httpQuery(key: string, query: string): Promise<any> {
    const options = validateClass(HttpParams, JSON.parse(query));
    const sourceConfig = await DataSourceService.getByTypeKey('http', key);
    let { host } = sourceConfig.config;
    if (!host) {
      host = options.host;
    }
    return await APIClient.request(host)(options);
  }
}
