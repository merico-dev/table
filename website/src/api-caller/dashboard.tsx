import { IDashboard } from '@devtable/dashboard';
import { TDashboardMetaInfo } from './dashboard.typed';
import { post, put } from './request';
import { PaginationResponse } from './types';

export const dashboard = {
  list: async (signal?: AbortSignal): Promise<PaginationResponse<TDashboardMetaInfo>> => {
    return post(signal)('/dashboard/list', {
      filter: {
        is_removed: false,
      },
      sort: [
        {
          field: 'name',
          order: 'ASC',
        },
        {
          field: 'create_time',
          order: 'ASC',
        },
      ],
      pagination: {
        page: 1,
        pagesize: 1000,
      },
    });
  },
  details: async (id: string, signal?: AbortSignal): Promise<TDashboardMetaInfo> => {
    return post(signal)(`/dashboard/details`, { id });
  },
  update: async ({ id, name, group, content_id }: IDashboard, signal?: AbortSignal): Promise<TDashboardMetaInfo> => {
    const payload = {
      id,
      name,
      group,
      content_id,
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
