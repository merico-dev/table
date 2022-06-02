import pgDataSources from '../data_sources/postgres';
import _ from 'lodash';
import { ApiError, NOT_FOUND, BAD_REQUEST } from '../utils/errors';

export class QueryService {
  async listSources(): Promise<object> {
    const sources = {};
    sources['postgresql'] = _.keys(pgDataSources);

    return sources;
  }

  async query(type: string, key: string, sql: string): Promise<any> {
    switch (type) {
      case 'postgresql':
        return await this.postgresqlQuery(key, sql);
    
      default:
        throw new ApiError(BAD_REQUEST, { message: 'unsupported datasource type' })
    }
  }

  private async postgresqlQuery(key: string, sql: string): Promise<object[]> {
    const source = pgDataSources[key];
    if (!source) {
      throw new ApiError(NOT_FOUND, { message: 'postgres datasource not found' });
    }
    const result = await source.query(sql);
    return result;
  }
}