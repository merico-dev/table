import dayjs from 'dayjs';
import { ListDashboardPermissionReqType, ListDashboardPermissionRespType } from './dashboard-permission.types';
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
};
