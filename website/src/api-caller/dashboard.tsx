import { IDashboard } from '@devtable/dashboard';
import { IDBDashboard } from './dashboard.typed';
import { post, put } from './request';
import { PaginationResponse } from './types';

export const DashboardAPI = {
  list: async (): Promise<PaginationResponse<IDBDashboard>> => {
    return await post('/dashboard/list', {
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
  },
  details: async (id: string): Promise<IDBDashboard> => {
    return await post(`/dashboard/details`, { id });
  },
  update: async ({ id, name, definition, views, filters, version }: IDashboard): Promise<IDBDashboard> => {
    const payload = {
      id,
      name,
      content: {
        definition,
        views,
        filters,
        version,
      },
    };
    return await put('/dashboard/update', payload);
  },
  create: async (name: string, content?: IDBDashboard['content']): Promise<IDBDashboard> => {
    if (!content) {
      content = {
        definition: {
          sqlSnippets: [],
          queries: [],
          mock_context: {},
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
        version: '6.7.0',
      };
    }
    return await post('/dashboard/create', {
      name,
      content,
    });
  },
  delete: async (id: string): Promise<void> => {
    if (!id) {
      return;
    }
    return await post('/dashboard/delete', { id });
  },
};
