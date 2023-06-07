import dayjs from 'dayjs';
import {
  ListSQLSnippetReqType,
  ListSQLSnippetRespType,
  SQLSnippetDBType,
  TCreateSQLSnippetPayload,
  TUpdateSQLSnippetPayload,
} from './sql_snippet.types';
import { APIClient } from './request';

export const sql_snippet = {
  list: async (
    { filter, pagination }: ListSQLSnippetReqType,
    signal?: AbortSignal,
  ): Promise<ListSQLSnippetRespType> => {
    const resp: ListSQLSnippetRespType = await APIClient.getRequest('POST')('/sql_snippet/list', {
      filter,
      sort: [
        {
          field: 'update_time',
          order: 'DESC',
        },
      ],
      pagination,
    });
    resp.data.forEach((d) => {
      d.create_time = dayjs(d.create_time).format('YYYY-MM-DD HH:mm:ss');
      d.update_time = dayjs(d.update_time).format('YYYY-MM-DD HH:mm:ss');
    });
    return resp;
  },
  get: async (id: string, signal?: AbortSignal): Promise<SQLSnippetDBType | null> => {
    const resp: SQLSnippetDBType = await APIClient.getRequest('POST')('/sql_snippet/get', {
      id,
    });
    return resp;
  },
  create: async (payload: TCreateSQLSnippetPayload, signal?: AbortSignal): Promise<SQLSnippetDBType> => {
    const resp: SQLSnippetDBType = await APIClient.getRequest('POST')('/sql_snippet/create', payload);
    return resp;
  },
  update: async (payload: TUpdateSQLSnippetPayload, signal?: AbortSignal): Promise<SQLSnippetDBType> => {
    const resp: SQLSnippetDBType = await APIClient.getRequest('POST')('/sql_snippet/update', payload);
    return resp;
  },
  delete: async (id: string, signal?: AbortSignal): Promise<void> => {
    return APIClient.getRequest('POST')('/sql_snippet/delete', { id });
  },
};
