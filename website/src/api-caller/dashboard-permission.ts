import dayjs from 'dayjs';
import {
  DashboardPermissionDBType,
  ListDashboardPermissionReqType,
  ListDashboardPermissionRespType,
} from './dashboard-permission.types';
import { post } from './request';

export const DashboardPermissionAPI = {
  list: async ({ filter, pagination }: ListDashboardPermissionReqType): Promise<ListDashboardPermissionRespType> => {
    const resp: ListDashboardPermissionRespType = await post('/dashboard_permission/list', {
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
  get: async (id: string): Promise<DashboardPermissionDBType | null> => {
    try {
      const resp = await DashboardPermissionAPI.list({
        filter: { id: { value: id, isFuzzy: false } },
        pagination: { page: 1, pagesize: 100000 },
      });
      return resp.data[0] ?? null;
    } catch (err) {
      console.error(err);
      return null;
    }
  },
};