import { IAPIKey } from '@devtable/settings-form';
import { post } from './request';
import { PaginationResponse } from './types';

export const api_key = {
  list: async (signal?: AbortSignal): Promise<PaginationResponse<IAPIKey>> => {
    const res = await post(signal)('/api/key/list', {
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
