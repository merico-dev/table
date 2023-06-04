import { DataSourceType, IDataSource, TDataSourceConfig } from './datasource.typed';
import { APIClient } from './request';
import { PaginationResponse } from './types';

export const datasource = {
  list: async (): Promise<PaginationResponse<IDataSource>> => {
    return await APIClient.getRequest('POST')('/datasource/list', {
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
  },
  create: async (
    type: DataSourceType,
    key: string,
    config: TDataSourceConfig,
  ): Promise<PaginationResponse<IDataSource> | false> => {
    return await APIClient.getRequest('POST')('/datasource/create', {
      type,
      key,
      config,
    });
  },
  update: async (id: string, config: TDataSourceConfig): Promise<PaginationResponse<IDataSource>> => {
    return await APIClient.getRequest('PUT')('/datasource/update', {
      id,
      config,
    });
  },
  delete: async (id: string): Promise<void> => {
    await APIClient.getRequest('POST')('/datasource/delete', { id });
  },
};
