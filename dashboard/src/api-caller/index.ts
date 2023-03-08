import {
  explainHTTPRequest,
  postProcessWithDataSource,
  postProcessWithQuery,
  preProcessWithDataSource,
} from '~/utils/http-query';
import { FilterValuesType } from '../model';
import { ContextInfoType } from '../model/context';
import { DataSourceType } from '../model/queries/types';
import { SQLSnippetModelInstance } from '../model/sql-snippets';
import { formatSQL, getSQLParams } from '../utils/sql';
import { APIClient } from './request';
import { IDataSource, PaginationResponse } from './types';

export type QueryFailureError = {
  code: 'BAD_REQUEST';
  detail: {
    message: string;
  };
};

interface IQueryBySQL {
  context: ContextInfoType;
  mock_context: Record<string, $TSFixMe>;
  sqlSnippets: SQLSnippetModelInstance[];
  title: string;
  query: { type: DataSourceType; key: string; sql: string };
  filterValues: FilterValuesType;
}

export async function queryBySQL(
  { context, mock_context, sqlSnippets, query, filterValues }: IQueryBySQL,
  signal: AbortSignal,
) {
  if (!query.sql) {
    return [];
  }
  const { type, key, sql } = query;

  const params = getSQLParams(context, mock_context, sqlSnippets, filterValues);
  const formattedSQL = formatSQL(sql, params);
  const res = await APIClient.getRequest('POST', signal)('/query', { type, key, query: formattedSQL }, {});
  return res;
}

interface IQueryByHTTP {
  context: ContextInfoType;
  mock_context: Record<string, $TSFixMe>;
  query: { type: DataSourceType; key: string; name: string; pre_process: string; post_process: string };
  filterValues: FilterValuesType;
  datasource: IDataSource;
}

export async function queryByHTTP(
  { context, mock_context, query, filterValues, datasource }: IQueryByHTTP,
  signal: AbortSignal,
) {
  const { type, key, name, pre_process, post_process } = query;

  let config = explainHTTPRequest(pre_process, context, mock_context, filterValues);
  console.groupCollapsed(`Request config for: ${name}`);
  console.log(config);
  console.groupEnd();

  config = preProcessWithDataSource(datasource, config);
  const configString = JSON.stringify(config);
  const res = await APIClient.getRequest('POST', signal)('/query', { type, key, query: configString }, {});
  let data = postProcessWithDataSource(datasource, res);
  data = postProcessWithQuery(post_process, data);
  return data;
}

export type TQuerySources = Record<string, string[]>;

export async function listDataSources(): Promise<IDataSource[]> {
  try {
    const res: PaginationResponse<IDataSource> = await APIClient.getRequest('POST')('/datasource/list', {
      filter: {},
      sort: [
        {
          field: 'create_time',
          order: 'ASC',
        },
      ],
      pagination: {
        page: 1,
        pagesize: 100,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
