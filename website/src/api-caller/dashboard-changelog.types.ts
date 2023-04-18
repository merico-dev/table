import { PaginationResponse } from './types';

export type DashboardChangelogDBType = {
  id: string;
  diff: string;
  create_time: string;
  dashboard_id: string;
};

export type ListDashboardChangelogReqType = {
  filter: {
    dashboard_id: { value: string; isFuzzy: false };
  };
  pagination: {
    page: number;
    pagesize: number;
  };
};

export type ListDashboardChangelogRespType = PaginationResponse<DashboardChangelogDBType>;
