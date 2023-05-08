import dayjs from 'dayjs';
import {
  DashboardPermissionDBType,
  UpdateDashboardOwnerPayloadType,
  ListDashboardPermissionReqType,
  ListDashboardPermissionRespType,
  UpdatePermissionPayloadType,
} from './dashboard-permission.types';
import { post } from './request';

export const dashboard_permission = {
  list: async (
    { filter, pagination }: ListDashboardPermissionReqType,
    signal?: AbortSignal,
  ): Promise<ListDashboardPermissionRespType> => {
    const resp: ListDashboardPermissionRespType = await post(signal)('/dashboard_permission/list', {
      filter,
      sort: [
        {
          field: 'create_time',
          order: 'DESC',
        },
      ],
      pagination,
    });
    resp.data.forEach((d) => {
      d.create_time = dayjs(d.create_time).format('YYYY-MM-DD HH:mm:ss');
    });
    return resp;
  },
  emptyList: {
    data: [],
    total: 0,
    offset: 0,
  },
  get: async (id: string, signal?: AbortSignal): Promise<DashboardPermissionDBType | null> => {
    try {
      const resp: DashboardPermissionDBType = await post(signal)('/dashboard_permission/get', {
        id,
      });
      resp.create_time = dayjs(resp.create_time).format('YYYY-MM-DD HH:mm:ss');
      resp.update_time = dayjs(resp.update_time).format('YYYY-MM-DD HH:mm:ss');
      return resp;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
  updateOwner: async (
    payload: UpdateDashboardOwnerPayloadType,
    signal?: AbortSignal,
  ): Promise<DashboardPermissionDBType | null> => {
    const resp: DashboardPermissionDBType = await post(signal)('/dashboard_permission/updateOwner', payload);
    return resp;
  },
  update: async (
    payload: UpdatePermissionPayloadType,
    signal?: AbortSignal,
  ): Promise<DashboardPermissionDBType | null> => {
    const resp: DashboardPermissionDBType = await post(signal)('/dashboard_permission/update', payload);
    return resp;
  },
};
