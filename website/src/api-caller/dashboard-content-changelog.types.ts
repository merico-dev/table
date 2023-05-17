import { PaginationResponse } from './types';

export type DashboardContentChangelogDBType = {
  id: string;
  diff: string;
  create_time: string;
  dashboard_id: string;
};

export type ListDashboardContentChangelogReqType = {
  filter: {
    dashboard_content_id: { value: string; isFuzzy: false };
  };
  pagination: {
    page: number;
    pagesize: number;
  };
};

export type ListDashboardContentChangelogRespType = PaginationResponse<DashboardContentChangelogDBType>;
