import dayjs from 'dayjs';
import { ListDashboardChangelogReqType, ListDashboardChangelogRespType } from './dashboard-changelog.types';
import { post } from './request';

export const dashboard_changelog = {
  list: async (
    { filter, pagination }: ListDashboardChangelogReqType,
    signal?: AbortSignal,
  ): Promise<ListDashboardChangelogRespType> => {
    const resp: ListDashboardChangelogRespType = await post(signal)('/dashboard_changelog/list', {
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
