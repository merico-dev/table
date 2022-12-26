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
  { context, mock_context, sqlSnippets, title, query, filterValues }: IQueryBySQL,
  signal: AbortSignal,
) {
  if (!query.sql) {
    return [];
  }
  const { type, key, sql } = query;

  const needParams = sql.includes('$');
  const params = getSQLParams(context, mock_context, sqlSnippets, filterValues);
  const formattedSQL = formatSQL(sql, params);
  if (needParams) {
    console.groupCollapsed(`Final SQL for: ${title}`);
    console.log(formattedSQL);
    console.groupEnd();
  }
  const res = await APIClient.getRequest('POST', signal)('/query', { type, key, query: formattedSQL }, {});
  return res;
}

export type TQuerySources = Record<string, string[]>;

export async function listDataSources(): Promise<IDataSource[]> {
  try {
    const res: PaginationResponse<IDataSource> = await APIClient.getRequest('POST')('/datasource/list', {
      filter: {},
      sort: {
        field: 'create_time',
        order: 'ASC',
      },
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
