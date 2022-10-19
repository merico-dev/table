import { IDashboard } from '@devtable/dashboard';
import { normalizeDBDashboard } from './dashboard.transform';
import { IDBDashboard } from './dashboard.typed';
import { get, post, put } from './request';
import { PaginationResponse } from './types';

export const DashboardAPI = {
  list: async (): Promise<PaginationResponse<IDBDashboard>> => {
    const res = await post('/dashboard/list', {
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
    return res;
  },
  details: async (id: string): Promise<IDashboard> => {
    const res = await get(`/dashboard/details/${id}`, {});
    return normalizeDBDashboard(res);
  },
  update: async ({ id, name, definition, views, filters }: IDashboard): Promise<IDashboard> => {
    const payload = {
      id,
      name,
      content: {
        definition,
        views,
        filters,
      },
    };
    const res: IDBDashboard = await put('/dashboard/update', payload);
    return normalizeDBDashboard(res);
  },
  create: async (name: string, content?: IDBDashboard['content']): Promise<IDashboard> => {
    if (!content) {
      content = {
        definition: {
          sqlSnippets: [],
          queries: [],
        },
        views: [
          {
            id: 'Main',
            name: 'Main',
            type: 'div',
            config: {},
            panels: [],
          },
        ],
        filters: [],
        version: '4.16.4',
      };
    }
    const res: IDBDashboard = await post('/dashboard/create', {
      name,
      content,
    });
    return normalizeDBDashboard(res);
  },
  delete: async (id: string): Promise<void> => {
    if (!id) {
      return;
    }
    return await post('/dashboard/delete', { id });
  },
};
