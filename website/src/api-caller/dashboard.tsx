import { IDashboard } from '@devtable/dashboard';
import { IDBDashboard } from './dashboard.typed';
import { post, put } from './request';
import { PaginationResponse } from './types';

export const DashboardAPI = {
  list: async (): Promise<PaginationResponse<IDBDashboard>> => {
    return await post('/dashboard/list', {
      filter: {
        is_removed: false,
      },
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
  details: async (id: string): Promise<IDBDashboard> => {
    return await post(`/dashboard/details`, { id });
  },
  update: async ({ id, name, group, definition, views, filters, version }: IDashboard): Promise<IDBDashboard> => {
    const payload = {
      id,
      name,
      group,
      content: {
        definition,
        views,
        filters,
        version,
      },
    };
    return await put('/dashboard/update', payload);
  },
  create: async (name: string, group: string, content?: IDBDashboard['content']): Promise<IDBDashboard> => {
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
      group,
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
