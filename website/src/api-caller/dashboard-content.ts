import {
  DashboardContentDBType,
  ListDashboardContentReqType,
  ListDashboardContentRespType,
  CreateContentPayloadType,
  UpdateContentPayloadType,
  DeleteContentPayloadType,
} from './dashboard-content.types';
import { post, put } from './request';

export const dashboard_content = {
  list: async (
    { dashboard_id, filter, pagination }: ListDashboardContentReqType,
    signal?: AbortSignal,
  ): Promise<ListDashboardContentRespType> => {
    const resp: ListDashboardContentRespType = await post(signal)('/dashboard_content/list', {
      dashboard_id,
      filter,
      sort: [
        {
          field: 'create_time',
          order: 'DESC',
        },
      ],
      pagination,
    });
    return resp;
  },
  emptyList: {
    data: [],
    total: 0,
    offset: 0,
  },
  details: async (id: string, signal?: AbortSignal): Promise<DashboardContentDBType | null> => {
    try {
      const resp: DashboardContentDBType = await post(signal)('/dashboard_content/details', {
        id,
      });
      return resp;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  create: async (payload: CreateContentPayloadType, signal?: AbortSignal): Promise<DashboardContentDBType | null> => {
    const resp: DashboardContentDBType = await post(signal)('/dashboard_content/create', payload);
    return resp;
  },
  update: async (payload: UpdateContentPayloadType, signal?: AbortSignal): Promise<DashboardContentDBType | null> => {
    const resp: DashboardContentDBType = await put(signal)('/dashboard_content/update', payload);
    return resp;
  },
  delete: async (payload: DeleteContentPayloadType, signal?: AbortSignal): Promise<void> => {
    return post(signal)('/dashboard_content/delete', payload);
  },
};
