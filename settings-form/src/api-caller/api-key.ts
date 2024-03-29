import { IAPIKey } from './api-key.typed';
import { APIClient } from './request';
import { PaginationResponse } from './types';

export const api_key = {
  list: async (): Promise<PaginationResponse<IAPIKey>> => {
    const res = await APIClient.post()(
      '/api/key/list',
      {
        filter: {
          search: '',
        },
        sort: [
          {
            field: 'name',
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
    return res;
  },
  create: async (name: string, role_id: string): Promise<{ app_id: string; app_secret: string }> => {
    return APIClient.post()(
      '/api/key/create',
      {
        name,
        role_id,
      },
      {},
    );
  },
  delete: async (id: string): Promise<void> => {
    if (!id) {
      return;
    }
    return APIClient.post()('/api/key/delete', { id }, {});
  },
};
