import dayjs from 'dayjs';
import {
  ListDashboardContentChangelogReqType,
  ListDashboardContentChangelogRespType,
} from './dashboard-content-changelog.types';
import { post } from './request';

export const dashboard_content_changelog = {
  list: async (
    { filter, pagination }: ListDashboardContentChangelogReqType,
    signal?: AbortSignal,
  ): Promise<ListDashboardContentChangelogRespType> => {
    const resp: ListDashboardContentChangelogRespType = await post(signal)('/dashboard_content_changelog/list', {
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
