import { IDashboard } from '@devtable/dashboard';
import { IDBDashboard, TDashboardMetaInfo } from './dashboard.typed';
import { post, put } from './request';
import { PaginationResponse } from './types';

// WIP
const InitialDashboardContent = {
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
    },
  ],
  panels: [],
  filters: [],
  version: '8.57.0',
};

export const dashboard = {
  list: async (signal?: AbortSignal): Promise<PaginationResponse<TDashboardMetaInfo>> => {
    return await post(signal)('/dashboard/list', {
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
  details: async (id: string, signal?: AbortSignal): Promise<TDashboardMetaInfo> => {
    return post(signal)(`/dashboard/details`, { id });
  },
  update: async (
    { id, name, group, definition, views, panels, filters, version }: IDashboard,
    signal?: AbortSignal,
  ): Promise<TDashboardMetaInfo> => {
    const payload = {
      id,
      name,
      group,
      content: {
        views,
        panels,
        filters,
        version,
        definition,
      },
    };
    return put(signal)('/dashboard/update', payload);
  },
  rename: async (
    { id, name, group }: Pick<IDashboard, 'id' | 'name' | 'group'>,
    signal?: AbortSignal,
  ): Promise<TDashboardMetaInfo> => {
    const payload = {
      id,
      name,
      group,
    };
    return put(signal)('/dashboard/update', payload);
  },
  create: async (name: string, group: string, signal?: AbortSignal): Promise<TDashboardMetaInfo> => {
    return post(signal)('/dashboard/create', {
      name,
      group,
    });
  },
  delete: async (id: string, signal?: AbortSignal): Promise<void> => {
    if (!id) {
      return;
    }
    return post(signal)('/dashboard/delete', { id });
  },
};
