import { APIClient } from '../utils/api_client';
import { DataSourceService } from './datasource.service';
import { Any, DataSource } from 'typeorm';
import { configureDatabaseSource } from '../utils/helpers';
import { validateClass } from '../middleware/validation';
import { HttpParams, QueryParams } from '../api_models/query';
import { sqlRewriter } from '../plugins';
import { ApiError, BAD_REQUEST, QUERY_ERROR } from '../utils/errors';
import { getFsCache, getFsCacheKey, isFsCacheEnabled, putFsCache } from '../utils/fs_cache';
import { injectable } from 'inversify';
import { ApiKey } from '../api_models/api';
import { Account } from '../api_models/account';
import { dashboardDataSource } from '../data_sources/dashboard';
import DashboardContent from '../models/dashboard_content';
import { DashboardPermissionService } from './dashboard_permission.service';
import { has } from 'lodash';
import { translate } from '../utils/i18n';
import SqlSnippet from '../models/sql_snippet';
import { QUERY_PARSING_ENABLED } from '../utils/constants';
import { PERMISSIONS } from './role.service';
import { Query, Snippet } from '../api_models/dashboard_content';

@injectable()
export class QueryService {
  static dbConnections: { [hash: string]: DataSource } = {};

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

  private getDBStructureSql(): string {
    return 'SELECT table_schema, table_name, table_type FROM information_schema.tables ORDER BY table_schema, table_name';
  }

  private getColumnStructureSql(type: string, table_schema: string, table_name: string): string {
    if (type === 'postgresql') {
      const attrelid = `'${table_schema}.${table_name}'::regclass`;
      return `
          SELECT
            ordinal_position,
            UPPER(pc.contype) AS column_key,
            pg_get_constraintdef(pc.oid) AS column_key_text,
            column_name,
            format_type(atttypid, atttypmod) AS column_type,
            is_nullable,
            column_default,
            pg_catalog.col_description(${attrelid}, ordinal_position) AS column_comment
          FROM
            information_schema.columns
            JOIN pg_attribute pa ON pa.attrelid = ${attrelid}
              AND attname = column_name
            LEFT JOIN pg_constraint pc ON pc.conrelid = ${attrelid} AND ordinal_position = any(pc.conkey)
          WHERE
            table_name = '${table_name}' AND table_schema = '${table_schema}';
        `;
    }
    if (type === 'mysql') {
      return `
          SELECT ordinal_position, column_key, column_name, column_type, is_nullable, column_default, column_comment
          FROM information_schema.columns
          WHERE table_name = '${table_name}' AND table_schema = '${table_schema}'
        `;
    }
    return '';
  }

  private getDataSql(table_schema: string, table_name: string, limit: number, offset: number): string {
    return `
      SELECT *
      FROM ${table_schema}.${table_name}
      LIMIT ${limit} OFFSET ${offset}`;
  }

  private getIndexesSql(type: string, table_schema: string, table_name: string): string {
    if (type === 'postgresql') {
      return `
          SELECT
            ix.relname AS index_name,
            upper(am.amname) AS index_algorithm,
            indisunique AS is_unique,
            pg_get_indexdef(indexrelid) AS index_definition,
            CASE WHEN position(' WHERE ' IN pg_get_indexdef(indexrelid)) > 0 THEN
              regexp_replace(pg_get_indexdef(indexrelid), '.+WHERE ', '')
            WHEN position(' WITH ' IN pg_get_indexdef(indexrelid)) > 0 THEN
              regexp_replace(pg_get_indexdef(indexrelid), '.+WITH ', '')
            ELSE
              ''
            END AS condition,
            pg_catalog.obj_description(i.indexrelid, 'pg_class') AS comment
          FROM
            pg_index i
            JOIN pg_class t ON t.oid = i.indrelid
            JOIN pg_class ix ON ix.oid = i.indexrelid
            JOIN pg_namespace n ON t.relnamespace = n.oid
            JOIN pg_am AS am ON ix.relam = am.oid
          WHERE
            t.relname = '${table_name}' AND n.nspname = '${table_schema}';
        `;
    }
    if (type === 'mysql') {
      return `
          SELECT
            sub_part AS index_length,
            index_name AS index_name,
            index_type AS index_algorithm,
            CASE non_unique WHEN 0 THEN 'TRUE' ELSE 'FALSE' END AS is_unique,
            column_name AS column_name
          FROM
            information_schema.statistics
          WHERE
            table_name = '${table_name}' AND table_schema = '${table_schema}'
          ORDER BY
            seq_in_index ASC;
        `;
    }
    return '';
  }

  private getCountSql(table_schema: string, table_name: string): string {
    return `
        SELECT count(*) AS total
        FROM ${table_schema}.${table_name}
      `;
  }

  async queryStructure(
    query_type: string,
    type: string,
    key: string,
    table_schema: string,
    table_name: string,
    limit = 20,
    offset = 0,
  ): Promise<any> {
    let sql: string;
    switch (query_type) {
      case 'TABLES':
        sql = this.getDBStructureSql();
        break;
      case 'COLUMNS':
        sql = this.getColumnStructureSql(type, table_schema, table_name);
        break;
      case 'DATA':
        sql = this.getDataSql(table_schema, table_name, limit, offset);
        break;
      case 'INDEXES':
        sql = this.getIndexesSql(type, table_schema, table_name);
        break;
      case 'COUNT':
        sql = this.getCountSql(table_schema, table_name);
        break;

      default:
        return null;
    }

    let result;
    switch (type) {
      case 'postgresql':
        result = await this.postgresqlQuery(key, sql);
        break;

      case 'mysql':
        result = await this.mysqlQuery(key, sql);
        break;

      default:
        return null;
    }
    return result;
  }

  async query(
    type: string,
    key: string,
    query: string,
    content_id: string,
    query_id: string,
    params: QueryParams,
    env: Record<string, any>,
    refresh_cache = false,
    locale: string,
    auth?: Account | ApiKey,
  ): Promise<any> {
    const { parsedType, parsedKey, parsedQuery } = await this.prepareQuery(
      type,
      key,
      query,
      content_id,
      query_id,
      params,
      locale,
      auth,
    );

    let q: string = parsedQuery;
    if (['postgresql', 'mysql'].includes(parsedType)) {
      const { error, sql } = await sqlRewriter(q, env);
      if (error) {
        throw new ApiError(QUERY_ERROR, { message: error });
      }
      q = sql;
    }
    const fsCacheEnabled = await isFsCacheEnabled();
    const cacheKey = getFsCacheKey(`${parsedType}:${parsedKey}:${q}`);
    if (fsCacheEnabled && !refresh_cache) {
      const cached = await getFsCache(cacheKey);
      if (cached) {
        return cached;
      }
    }
    let result;
    switch (parsedType) {
      case 'postgresql':
        result = await this.postgresqlQuery(parsedKey, q);
        break;

      case 'mysql':
        result = await this.mysqlQuery(parsedKey, q);
        break;

      case 'http':
        result = await this.httpQuery(parsedKey, q);
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
    type: string,
    key: string,
    query: string,
    content_id: string,
    query_id: string,
    params: QueryParams,
    locale: string,
    auth?: Account | ApiKey,
  ): Promise<{ parsedType: string; parsedKey: string; parsedQuery: string }> {
    if (!QUERY_PARSING_ENABLED || auth?.permissions.includes(PERMISSIONS.DASHBOARD_MANAGE)) {
      return { parsedType: type, parsedKey: key, parsedQuery: query };
    }
    const dashboardContent = await dashboardDataSource
      .getRepository(DashboardContent)
      .findOneByOrFail({ id: content_id });

    let auth_id: string | undefined;
    let auth_type: 'APIKEY' | 'ACCOUNT' | undefined;
    let auth_role_id: string | undefined;
    let auth_permissions: string[] | undefined;
    if (auth) {
      auth_id = auth.id;
      auth_type = has(auth, 'app_id') ? 'APIKEY' : 'ACCOUNT';
      auth_role_id = auth.role_id;
      auth_permissions = auth.permissions;
    }
    await DashboardPermissionService.checkPermission(
      dashboardContent.dashboard_id,
      'VIEW',
      locale,
      auth_id,
      auth_type,
      auth_role_id,
      auth_permissions,
    );

    const content = dashboardContent.content;
    const rawQuery = content.definition.queries.find((x) => x.id === query_id);
    if (!rawQuery) {
      throw new ApiError(BAD_REQUEST, { message: translate('QUERY_ID_NOT_FOUND', locale) });
    }
    if (rawQuery.type === 'http') {
      return await this.prepareHTTPQuery(rawQuery, params, locale);
    }
    return await this.prepareDBQuery(rawQuery, content.definition.sqlSnippets, params, locale);
  }

  private async prepareHTTPQuery(
    rawQuery: Query,
    params: QueryParams,
    locale: string,
  ): Promise<{ parsedType: string; parsedKey: string; parsedQuery: string }> {
    try {
      const queryFunc = new Function(`return ${rawQuery.pre_process}`)();
      const query = queryFunc(params);
      return { parsedKey: rawQuery.key, parsedType: rawQuery.type, parsedQuery: JSON.stringify(query) };
    } catch (err) {
      throw new ApiError(BAD_REQUEST, { message: translate('QUERY_PARSING_ERROR', locale), details: err.message });
    }
  }

  private async prepareDBQuery(
    rawQuery: Query,
    snippets: Snippet[],
    params: QueryParams,
    locale: string,
  ): Promise<{ parsedType: string; parsedKey: string; parsedQuery: string }> {
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

      return { parsedType: rawQuery.type, parsedKey: rawQuery.key, parsedQuery: sql };
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
    return source.query(sql);
  }

  private async mysqlQuery(key: string, sql: string): Promise<any> {
    let source = QueryService.getDBConnection('mysql', key);
    if (!source) {
      const sourceConfig = await DataSourceService.getByTypeKey('mysql', key);
      const configuration = configureDatabaseSource('mysql', sourceConfig.config);
      source = new DataSource(configuration);
      await QueryService.addDBConnection('mysql', key, source);
    }
    return source.query(sql);
  }

  private async httpQuery(key: string, query: string): Promise<any> {
    const options = validateClass(HttpParams, JSON.parse(query));
    const sourceConfig = await DataSourceService.getByTypeKey('http', key);
    let { host } = sourceConfig.config;
    if (!host) {
      host = options.host;
    }
    return APIClient.request(host)(options);
  }
}
