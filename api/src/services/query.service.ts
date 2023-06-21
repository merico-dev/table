import { APIClient } from '../utils/api_client';
import { DataSourceService } from './datasource.service';
import { Any, DataSource } from 'typeorm';
import { configureDatabaseSource } from '../utils/helpers';
import { validateClass } from '../middleware/validation';
import { HttpParams, QueryParams } from '../api_models/query';
import { sqlRewriter } from '../plugins';
import { ApiError, BAD_REQUEST, QUERY_ERROR } from '../utils/errors';
import { getFsCache, getFsCacheKey, isFsCacheEnabled, putFsCache } from '../utils/fs_cache';
import { dashboardDataSource } from '../data_sources/dashboard';
import DashboardContent from '../models/dashboard_content';
import { translate } from '../utils/i18n';
import { DashboardPermissionService } from './dashboard_permission.service';
import Account from '../models/account';
import ApiKey from '../models/apiKey';
import SqlSnippet from '../models/sql_snippet';

type Query = {
  id: string;
  type: 'postgresql' | 'mysql' | 'http';
  key: string;
  sql: string;
};

type Snippet = {
  key: string;
  value: string;
};

type Content = {
  definition: {
    queries: Query[];
    sqlSnippets: Snippet[];
  };
};

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

  async query(
    content_id: string,
    query_id: string,
    params: QueryParams,
    env: Record<string, any>,
    refresh_cache = false,
    auth: Account | ApiKey | null,
    locale: string,
  ): Promise<any> {
    const { key, type, query } = await this.prepareQuery(content_id, query_id, params, auth, locale);

    let q: string = query;
    if (['postgresql', 'mysql'].includes(type)) {
      const { error, sql } = await sqlRewriter(query, env);
      if (error) {
        throw new ApiError(QUERY_ERROR, { message: error });
      }
      q = sql;
    }
    const fsCacheEnabled = await isFsCacheEnabled();
    const cacheKey = getFsCacheKey(`${type}:${key}:${q}`);
    if (fsCacheEnabled && !refresh_cache) {
      const cached = await getFsCache(cacheKey);
      if (cached) {
        return cached;
      }
    }
    let result;
    switch (type) {
      case 'postgresql':
        result = await this.postgresqlQuery(key, q);
        break;

      case 'mysql':
        result = await this.mysqlQuery(key, q);
        break;

      case 'http':
        result = await this.httpQuery(key, q);
        break;

      default:
        return null;
    }
    if (fsCacheEnabled) {
      await putFsCache(cacheKey, result);
    }
    return result;
  }

  private async prepareQuery(
    content_id: string,
    query_id: string,
    params: QueryParams,
    auth: Account | ApiKey | null,
    locale: string,
  ): Promise<{ type: string; key: string; query: string }> {
    const dashboardContent = await dashboardDataSource
      .getRepository(DashboardContent)
      .findOneByOrFail({ id: content_id });

    await DashboardPermissionService.checkPermission(
      dashboardContent.dashboard_id,
      'VIEW',
      locale,
      auth?.id,
      auth ? (auth instanceof ApiKey ? 'APIKEY' : 'ACCOUNT') : undefined,
      auth?.role_id,
    );

    const content = dashboardContent.content as Content;
    const rawQuery = content.definition.queries.find((x) => x.id === query_id);
    if (!rawQuery) {
      throw new ApiError(BAD_REQUEST, { message: translate('QUERY_ID_NOT_FOUND', locale) });
    }
    if (rawQuery.type === 'http') {
      return { type: rawQuery.type, key: rawQuery.key, query: rawQuery.sql };
    }

    return await this.prepareDBQuery(rawQuery, content.definition.sqlSnippets, params, locale);
  }

  private async prepareDBQuery(rawQuery: Query, snippets: Snippet[], params: QueryParams, locale: string) {
    try {
      const query = rawQuery.sql;

      const sqlSnippetKeys = this.extractKeysFromQuery(query, /sql_snippets\.[\w]+/gm, 'sql_snippets.', '');
      const sqlSnippets =
        sqlSnippetKeys.size > 0
          ? snippets
              .filter((el) => sqlSnippetKeys.has(el.key))
              .reduce((acc, cur) => {
                acc[cur.key] = new Function(...Object.keys(params), `return \`${cur.value}\``)(
                  ...Object.values(params),
                );
                return acc;
              }, {})
          : {};

      const globalSqlSnippetKeys = this.extractKeysFromQuery(
        query,
        /global_sql_snippets\.[\w]+/gm,
        'global_sql_snippets.',
        '',
      );
      const globalSqlSnippets =
        globalSqlSnippetKeys.size > 0
          ? (await dashboardDataSource.getRepository(SqlSnippet).findBy({ id: Any([...globalSqlSnippetKeys]) })).reduce(
              (acc, cur) => {
                acc[cur.id] = new Function(...Object.keys(params), `return \`${cur.content}\``)(
                  ...Object.values(params),
                );
                return acc;
              },
              {},
            )
          : [];

      const sql = new Function(...Object.keys(params), 'sql_snippets', 'global_sql_snippets', `return \`${query}\``)(
        ...Object.values(params),
        sqlSnippets,
        globalSqlSnippets,
      );
      return { type: rawQuery.type, key: rawQuery.key, query: sql };
    } catch (err) {
      throw new ApiError(BAD_REQUEST, { message: translate('QUERY_PARSING_ERROR', locale), details: err.message });
    }
  }

  private extractKeysFromQuery(query: string, regex: RegExp, search: string, replace: string): Set<string> {
    return new Set(query.match(regex)?.map((match) => match.replace(search, replace)));
  }

  private async postgresqlQuery(key: string, sql: string): Promise<any> {
    let source = QueryService.getDBConnection('postgresql', key);
    if (!source) {
      const sourceConfig = await DataSourceService.getByTypeKey('postgresql', key);
      const configuration = configureDatabaseSource('postgresql', sourceConfig.config);
      source = new DataSource(configuration);
      await QueryService.addDBConnection('postgresql', key, source);
    }
    return await source.query(sql);
  }

  private async mysqlQuery(key: string, sql: string): Promise<any> {
    let source = QueryService.getDBConnection('mysql', key);
    if (!source) {
      const sourceConfig = await DataSourceService.getByTypeKey('mysql', key);
      const configuration = configureDatabaseSource('mysql', sourceConfig.config);
      source = new DataSource(configuration);
      await QueryService.addDBConnection('mysql', key, source);
    }
    return await source.query(sql);
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
