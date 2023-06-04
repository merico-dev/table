import { FilterValuesType } from '../model';
import { ContextInfoType } from '../model/context';
import { DataSourceType } from '../model/queries/types';
import { SQLSnippetModelInstance } from '../model/sql-snippets';
import { formatSQL, getSQLParams, postProcessSQLQuery, preProcessSQLQuery } from '../utils/sql';
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
  query: { type: DataSourceType; key: string; sql: string; pre_process: string; post_process: string };
  filterValues: FilterValuesType;
}

export async function queryBySQL(
  { context, mock_context, sqlSnippets, query, filterValues }: IQueryBySQL,
  signal: AbortSignal,
) {
  if (!query.sql) {
    return [];
  }
  const { type, key, sql, pre_process, post_process } = query;

  const params = getSQLParams(context, mock_context, sqlSnippets, filterValues);
  const formattedSQL = formatSQL(sql, params);
  const finalSQL = preProcessSQLQuery({ sql: formattedSQL, pre_process });
  let data = await APIClient.query(signal)({ type, key, query: finalSQL }, {});
  data = postProcessSQLQuery(post_process, data);
  return data;
}

interface IQueryByHTTP {
  type: DataSourceType;
  key: string;
  configString: string;
}

export async function queryByHTTP({ type, key, configString }: IQueryByHTTP, signal: AbortSignal) {
  const res = await APIClient.query(signal)({ type, key, query: configString }, {});
  return res;
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
