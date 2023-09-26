import { DataSourceType, TPayloadForSQL } from '~/model';
import { formatSQL, postProcessSQLQuery, preProcessSQLQuery } from '../utils/sql';
import { APIClient } from './request';
import { IDataSource, PaginationResponse } from './types';
import { payloadToDashboardState } from '~/utils/dashboard-state';
import axios, { AxiosError } from 'axios';
import { AnyObject } from '..';

export type QueryFailureError = {
  code: 'BAD_REQUEST';
  detail: {
    message: string;
  };
};

interface IQueryBySQL {
  name: string;
  query: { type: DataSourceType; key: string; sql: string; pre_process: string; post_process: string };
  payload: TPayloadForSQL;
}

export async function queryBySQL({ query, name, payload }: IQueryBySQL, signal: AbortSignal) {
  if (!query.sql) {
    return [];
  }
  const { type, key, sql, pre_process, post_process } = query;

  const formattedSQL = formatSQL(sql, payload);
  const finalSQL = preProcessSQLQuery({ sql: formattedSQL, pre_process });
  let data = await APIClient.query(signal)({ type, key, query: finalSQL }, { params: { name } });
  data = postProcessSQLQuery(post_process, data, payloadToDashboardState(payload));
  return data;
}

interface IQueryByHTTP {
  type: DataSourceType;
  key: string;
  configString: string;
  name: string;
}

export async function queryByHTTP({ type, key, configString, name }: IQueryByHTTP, signal: AbortSignal) {
  try {
    const ret = await APIClient.httpDataSourceQuery<AnyObject>(signal)(
      { type, key, query: configString },
      { params: { name } },
    );
    return ret;
  } catch (error) {
    if (axios.isCancel(error)) {
      throw error;
    }
    console.error(error);
    return error as AxiosError<AnyObject>;
  }
}

export type TQuerySources = Record<string, string[]>;

export async function listDataSources(): Promise<IDataSource[]> {
  try {
    const res: PaginationResponse<IDataSource> = await APIClient.post()(
      '/datasource/list',
      {
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
      },
      {},
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export type GlobalSQLSnippetDBType = {
  id: string;
  content: string;
  is_preset: boolean;
  create_time: string;
  update_time: string;
};

export async function listGlobalSQLSnippets(): Promise<GlobalSQLSnippetDBType[]> {
  try {
    const res: PaginationResponse<GlobalSQLSnippetDBType> = await APIClient.post()(
      '/sql_snippet/list',
      {
        filter: {},
        sort: [
          {
            field: 'id',
            order: 'ASC',
          },
        ],
        pagination: {
          page: 1,
          pagesize: 1000,
        },
      },
      {},
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
