import { DataSourceType, IDataSource, IDataSourceConfig } from "./datasource.typed";
import { APIClient } from "./request";
import { PaginationResponse } from "./types";

export const datasource = {
  list: async (): Promise<PaginationResponse<IDataSource>> => {
    const res = await APIClient.getRequest('POST')('/datasource/list', {
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
  create: async (type: DataSourceType, key: string, config: IDataSourceConfig): Promise<PaginationResponse<IDataSource> | false> => {
    try {
      const res = await APIClient.getRequest('POST')('/datasource/create', { type, key, config })
      return res;
    } catch (error) {
      console.error(error)
      return false;
    }
  },
  delete: async (id: string): Promise<void> => {
    await APIClient.getRequest('POST')('/datasource/delete', { id })
  }
}