import { IAPIKey } from './api-key.typed';
import { APIClient } from './request';
import { PaginationResponse } from './types';

export const api_key = {
  list: async (): Promise<PaginationResponse<IAPIKey>> => {
    const res = await APIClient.getRequest('POST')('/key/list', {
      filter: {
        search: '',
      },
      sort: {
        field: 'name',
        order: 'ASC',
      },
      pagination: {
        page: 1,
        pagesize: 100,
      },
    });
    return res;
  },
  create: async (name: string, role_id: number, domain: string): Promise<string> => {
    const key: string = await APIClient.getRequest('POST')('/key/create', {
      name,
      role_id,
      domain,
    });
    return key;
  },
  delete: async (id: string): Promise<void> => {
    if (!id) {
      return;
    }
    return APIClient.getRequest('POST')('/key/delete', { id });
  },
};
