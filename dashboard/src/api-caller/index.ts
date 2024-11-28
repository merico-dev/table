import { DataSourceType, TPayloadForSQL } from '~/model';
import { formatSQL, postProcessSQLQuery, preProcessSQLQuery } from '../utils/sql';
import { APIClient, TAdditionalQueryInfo } from './request';
import { IDataSource, PaginationResponse } from './types';
import { payloadToDashboardState } from '~/utils';
import { encode, decode } from 'js-base64';
import axios, { AxiosError } from 'axios';
import { AnyObject } from '..';

export type QueryFailureError = {
  code: 'BAD_REQUEST';
  detail: {
    message: string;
  };
};

function consistencyCheck(before: string, after: string) {
  const v = decode(after);
  if (v === before) {
    return;
  }

  console.error('Inconsistent sql');
  console.groupCollapsed('Inconsistent sql');
  console.table({ before, after, v });
  console.groupEnd();
}

interface IQueryBySQL {
  name: string;
  query: { type: DataSourceType; key: string; sql: string; pre_process: string; post_process: string };
  payload: TPayloadForSQL;
  additionals: TAdditionalQueryInfo;
}

export async function queryBySQL({ query, name, payload, additionals }: IQueryBySQL, signal: AbortSignal) {
  if (!query.sql) {
    return [];
  }
  const { type, key, sql, pre_process, post_process } = query;

  const formattedSQL = formatSQL(sql, payload);
  const processedSQL = preProcessSQLQuery({ sql: formattedSQL, pre_process });
  const finalSQL = encode(processedSQL);
  consistencyCheck(processedSQL, finalSQL);
  let data = await APIClient.query(signal)({ type, key, query: finalSQL, ...additionals }, { params: { name } });
  data = postProcessSQLQuery(post_process, data, payloadToDashboardState(payload));
  return data;
}

interface IQueryByHTTP {
  type: DataSourceType;
  key: string;
  configString: string;
  name: string;
  additionals: TAdditionalQueryInfo;
}

export async function queryByHTTP({ type, key, configString, name, additionals }: IQueryByHTTP, signal: AbortSignal) {
  try {
    const ret = await APIClient.httpDataSourceQuery<AnyObject>(signal)(
      { type, key, query: configString, ...additionals },
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

type RunMetricQueryProps = {
  key: string;
  configString: string;
  name: string;
  additionals: TAdditionalQueryInfo;
};

export async function runMetricQuery(
  { key, configString, name, additionals }: RunMetricQueryProps,
  signal: AbortSignal,
) {
  try {
    console.log({ configString });
    const ret = await APIClient.mericoMetricQuery<AnyObject>(signal)(
      { type: 'merico_metric_system', key, query: configString, ...additionals },
      { params: { name } },
    );
    return ret;
  } catch (error) {
    throw error;
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
