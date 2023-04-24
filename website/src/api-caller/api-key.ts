import { IAPIKey } from '@devtable/settings-form';
import { post } from './request';
import { PaginationResponse } from './types';

export const APIKeyAPI = {
  list: async (): Promise<PaginationResponse<IAPIKey>> => {
    const res = await post('/api/key/list', {
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
        pagesize: 1000,
      },
    });
    return res;
  },
};
