import _ from 'lodash';
import { ContextInfoContextType, FilterValuesContextType } from '../contexts';
import { IDashboardDefinition, IQuery } from '../types';
import { formatSQL, getSQLParams } from '../utils/sql';
import { APIClient } from './request';
import { IDataSource, PaginationResponse } from './types';

interface IQueryByStaticSQL {
  type: 'postgresql';
  key: string;
  sql: string;
}

export const queryByStaticSQL =
  ({ type, key, sql }: IQueryByStaticSQL) =>
  async () => {
    if (!type || !key || !sql) {
      return [];
    }
    try {
      const res = await APIClient.getRequest('POST')('/query', { type, key, query: sql });
      return res;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

interface IQueryBySQL {
  context: ContextInfoContextType;
  definitions: IDashboardDefinition;
  title: string;
  query?: IQuery;
  filterValues: FilterValuesContextType;
}

export const queryBySQL =
  ({ context, definitions, title, query, filterValues }: IQueryBySQL) =>
  async () => {
    if (!query || !query.sql) {
      return [];
    }
    const { type, key, sql } = query;

    const needParams = sql.includes('$');
    try {
      const params = getSQLParams(context, definitions, filterValues);
      const formattedSQL = formatSQL(sql, params);
      if (needParams) {
        console.groupCollapsed(`Final SQL for: ${title}`);
        console.log(formattedSQL);
        console.groupEnd();
      }
      const res = await APIClient.getRequest('POST')('/query', { type, key, query: formattedSQL });
      return res;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

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
