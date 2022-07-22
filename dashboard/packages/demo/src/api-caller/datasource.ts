import { DataSourceType, IDataSource, IDataSourceConfig } from "./datasource.typed";
import { get, post, put } from "./request";
import { PaginationResponse } from "./types";

export const DatasourceAPI = {
  list: async (): Promise<PaginationResponse<IDataSource>> => {
    const res = await post('/datasource/list', {
      filter: {},
      sort: {
        field: 'create_time',
        order: 'ASC'
      },
      pagination: {
        page: 1,
        pagesize: 100
      }
    })
    return res;
  },
  create: async (type: DataSourceType, key: string, config: IDataSourceConfig): Promise<PaginationResponse<IDataSource>> => {
    const res = await post('/datasource/create', { type, key, config })
    return res;
  },
}